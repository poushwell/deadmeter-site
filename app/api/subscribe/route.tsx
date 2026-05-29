/**
 * app/api/subscribe/route.tsx
 *
 * POST /api/subscribe
 * Saves email to pulse_subscribers table, sends confirmation email via Resend.
 *
 * Schema ref:  TZ_04 §8.2 (pulse_subscribers table)
 * Env vars:    TZ_04 §6.1
 * Email from:  TZ_04 §9.1 (pulse@deadmeter.com)
 * Client lib:  TZ_04 §8.3 (createServerClient with SERVICE_ROLE_KEY)
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import PulseSubscribeEmail from '../../../emails/pulse-subscribe';

// ─── Env ──────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com';

// ─── Constants ────────────────────────────────────────────────────────────────

// Postgres error code for UNIQUE constraint violation
const PG_UNIQUE_VIOLATION = '23505';

// Valid source identifiers — keep in sync with call sites
// TZ_04 §8.2 schema comment: 'landing', 'pulse-page', 'tool-page', etc.
const VALID_SOURCES = [
  'landing',
  'pulse-page',
  'pulse-footer',
  'tool-page',
  'unknown',
] as const;

type SubscribeSource = (typeof VALID_SOURCES)[number];

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Structural email validation (RFC 5321 simplified).
 * Does not perform DNS lookup — purely string-based.
 */
function isValidEmail(value: string): boolean {
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function parseSource(raw: unknown): SubscribeSource {
  return VALID_SOURCES.includes(raw as SubscribeSource)
    ? (raw as SubscribeSource)
    : 'unknown';
}

// ─── Supabase service client ──────────────────────────────────────────────────

/**
 * Creates a Supabase server client using SERVICE_ROLE_KEY.
 * This bypasses Row Level Security — safe in server-only Route Handlers.
 * Never import this function from client components.
 *
 * Next.js 15+ requires await on cookies().
 * TZ_04 §8.3 pattern, adapted for service role + async cookies.
 */
async function createServiceClient() {
  const cookieStore = await cookies(); // Next.js 15+: cookies() returns Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Service role key bypasses RLS. Falls back to anon key in local dev
    // if SUPABASE_SERVICE_ROLE_KEY is not yet set.
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        // Route Handlers run after response is started — cannot set/remove cookies.
        set: () => {},
        remove: () => {},
      },
    }
  );
}

// ─── POST /api/subscribe ──────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // ── 1. Parse request body ──────────────────────────────────────────────────

  let rawEmail: unknown;
  let rawSource: unknown;

  try {
    const body: unknown = await request.json();

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    ({ email: rawEmail, source: rawSource } = body as Record<string, unknown>);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── 2. Validate ────────────────────────────────────────────────────────────

  if (typeof rawEmail !== 'string' || rawEmail.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 });
  }

  const email = rawEmail.trim().toLowerCase();
  const source = parseSource(rawSource);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }

  // ── 3. Check current subscription state ───────────────────────────────────

  const supabase = await createServiceClient();

  // .maybeSingle() returns null on zero rows instead of throwing.
  const { data: existing, error: selectError } = await supabase
    .from('pulse_subscribers')
    .select('id, unsubscribed_at')
    .eq('email', email)
    .maybeSingle();

  if (selectError) {
    console.error('[subscribe] select error:', selectError.message);
    return NextResponse.json(
      { error: 'Service unavailable. Please try again.' },
      { status: 503 }
    );
  }

  // ── 4. Insert or re-activate ───────────────────────────────────────────────

  let shouldSendEmail = false;

  if (existing !== null) {
    if (existing.unsubscribed_at === null) {
      // Active subscriber — silent success.
      // Do NOT indicate this email already exists (email enumeration protection).
      return NextResponse.json({ success: true });
    }

    // Previously unsubscribed — re-activate.
    const { error: updateError } = await supabase
      .from('pulse_subscribers')
      .update({ unsubscribed_at: null, source })
      .eq('email', email);

    if (updateError) {
      console.error('[subscribe] update error:', updateError.message);
      return NextResponse.json(
        { error: 'Service unavailable. Please try again.' },
        { status: 503 }
      );
    }

    shouldSendEmail = true;

  } else {
    // New subscriber.
    const { error: insertError } = await supabase
      .from('pulse_subscribers')
      .insert({ email, source });

    if (insertError) {
      // Concurrent request already inserted this email (race condition).
      // Treat as success — subscriber is in the table either way.
      if (insertError.code === PG_UNIQUE_VIOLATION) {
        return NextResponse.json({ success: true });
      }

      console.error('[subscribe] insert error:', insertError.message);
      return NextResponse.json(
        { error: 'Service unavailable. Please try again.' },
        { status: 503 }
      );
    }

    shouldSendEmail = true;
  }

  // ── 5. Send confirmation email ─────────────────────────────────────────────
  // Email failure must NOT fail the subscription — record is already persisted.
  // Log and continue regardless.

  if (shouldSendEmail) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      // render() is async in @react-email/render >= 0.0.12
      const html = await render(
        <PulseSubscribeEmail email={email} baseUrl={SITE_URL} />
      );

      const { error: emailError } = await resend.emails.send({
        from: 'Deadmeter <pulse@deadmeter.com>',
        to: email,
        subject: 'Pulse subscription confirmed',
        html,
      });

      if (emailError) {
        // Non-fatal — subscriber is saved, email just didn't go out.
        console.error('[subscribe] resend error:', emailError.message);
      }
    } catch (err) {
      console.error('[subscribe] email send threw:', err);
    }
  }

  // ── 6. Respond ─────────────────────────────────────────────────────────────

  return NextResponse.json({ success: true }, { status: 201 });
}

// Explicit rejection of all other HTTP methods.
export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}