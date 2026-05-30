/**
 * app/api/unsubscribe/route.ts
 *
 * GET  /api/unsubscribe?email=...
 * POST /api/unsubscribe        { email: string }
 *
 * One-click unsubscribe from Pulse email list.
 *
 * GET  — used by mailto: List-Unsubscribe header and email link clicks.
 *         RFC 8058: one-click must be a POST, but most clients send GET first.
 *         We handle both so that clicking the link in an email client works.
 *
 * POST — used by programmatic unsubscribe (List-Unsubscribe: One-Click header).
 *
 * On success: sets unsubscribed_at = NOW() in pulse_subscribers.
 * Idempotent: unsubscribing an already-unsubscribed email is a no-op (200 OK).
 * Non-existent email: returns 200 OK (no enumeration).
 *
 * TZ_03 §9.4: "One click to unsubscribe"
 * TZ_03 §11.1 (Privacy): "Until you unsubscribe. One-click unsubscribe in every email."
 * TZ_04 §8.2: pulse_subscribers table — unsubscribed_at TIMESTAMPTZ
 * emails/pulse-subscribe.tsx: unsubscribeUrl = `/api/unsubscribe?email=${encodeURIComponent(email)}`
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ─── Env ──────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com';

// ─── Service client (bypasses RLS) ────────────────────────────────────────────

async function createServiceClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}

// ─── Core logic ───────────────────────────────────────────────────────────────

async function handleUnsubscribe(
  email: string
): Promise<{ ok: boolean; alreadyUnsubscribed: boolean }> {
  const supabase = await createServiceClient();

  // Find subscriber
  const { data: row, error: selectError } = await supabase
    .from('pulse_subscribers')
    .select('id, unsubscribed_at')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (selectError) {
    console.error('[unsubscribe] select error:', selectError.message);
    return { ok: false, alreadyUnsubscribed: false };
  }

  // Email not in list — treat as success (no enumeration)
  if (!row) return { ok: true, alreadyUnsubscribed: false };

  // Already unsubscribed — idempotent
  if (row.unsubscribed_at !== null) {
    return { ok: true, alreadyUnsubscribed: true };
  }

  // Set unsubscribed_at
  const { error: updateError } = await supabase
    .from('pulse_subscribers')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('id', row.id);

  if (updateError) {
    console.error('[unsubscribe] update error:', updateError.message);
    return { ok: false, alreadyUnsubscribed: false };
  }

  return { ok: true, alreadyUnsubscribed: false };
}

// ─── GET /api/unsubscribe?email=... ──────────────────────────────────────────
// Handles click from email link. Redirects to a confirmation page on success.

export async function GET(request: NextRequest): Promise<NextResponse> {
  const email = request.nextUrl.searchParams.get('email');

  if (!email || email.trim() === '') {
    return NextResponse.redirect(`${SITE_URL}/?unsubscribe=invalid`);
  }

  const { ok } = await handleUnsubscribe(email);

  if (!ok) {
    return NextResponse.redirect(`${SITE_URL}/?unsubscribe=error`);
  }

  // Redirect to pulse archive with confirmation banner
  // The UI can read the query param and show "You've been unsubscribed."
  return NextResponse.redirect(`${SITE_URL}/pulse?unsubscribed=1`);
}

// ─── POST /api/unsubscribe ────────────────────────────────────────────────────
// RFC 8058 one-click unsubscribe. Body: { email: string } or form-encoded.

export async function POST(request: NextRequest): Promise<NextResponse> {
  let email: string | null = null;

  // RFC 8058: email client POSTs to the List-Unsubscribe URL which already has
  // ?email=... as a query param. Check query string first.
  const queryEmail = request.nextUrl.searchParams.get('email');
  if (queryEmail && queryEmail.trim() !== '') {
    email = queryEmail;
  } else {
    const contentType = request.headers.get('content-type') ?? '';

    // RFC 8058 clients may also send application/x-www-form-urlencoded body
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const raw = formData.get('email');
      email = typeof raw === 'string' ? raw : null;
    } else {
      // JSON body from our own UI
      try {
        const body = await request.json() as Record<string, unknown>;
        email = typeof body.email === 'string' ? body.email : null;
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
      }
    }
  }

  if (!email || email.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 });
  }

  const { ok } = await handleUnsubscribe(email);

  if (!ok) {
    return NextResponse.json(
      { error: 'Service unavailable. Please try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}