/**
 * app/api/cert/notify/route.ts
 *
 * POST /api/cert/notify
 *
 * Called by CertClient when the user enters email in the "email-me when ready"
 * state (after 90 seconds of processing with no result).
 *
 * Saves { cert_hash, email } to cert_notifications table.
 * When the backend finishes processing (via Cloudflare Tunnel), it will
 * read pending rows and send completion emails.
 *
 * Schema: cert_notifications (cert_hash TEXT, email TEXT, notified_at TIMESTAMPTZ)
 * UNIQUE (cert_hash, email) — idempotent inserts.
 *
 * TZ_04 §8.2: cert_notifications table
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ─── Service client (no cookies needed) ──────────────────────────────────────

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => undefined, set: () => {}, remove: () => {} } }
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// ─── POST /api/cert/notify ────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // 1. Parse
  let email: unknown;
  let certHash: unknown;
  try {
    const body = await request.json() as Record<string, unknown>;
    email    = body.email;
    certHash = body.cert_hash;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 2. Validate
  if (typeof email !== 'string' || email.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 });
  }
  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }
  // cert_hash may be null/empty if the backend hasn't returned a hash yet
  // (email-me state fires at 90s while cert is still processing).
  // Use 'pending:' prefix + email as lookup key when no hash available.
  const cleanEmail = email.trim().toLowerCase();
  const cleanHash  = (typeof certHash === 'string' && certHash.trim() !== '')
    ? certHash.trim()
    : `pending:${cleanEmail}`;

  // 3. Guard on service role
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[cert/notify] SUPABASE_SERVICE_ROLE_KEY not set');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // 4. Insert into cert_notifications
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('cert_notifications')
    .insert({
      cert_hash:    cleanHash,
      email:        cleanEmail,
      requested_at: new Date().toISOString(),
      notified_at:  null, // pending
    });

  if (error) {
    // UNIQUE (cert_hash, email) — already registered, treat as success
    if (error.code === '23505') {
      return NextResponse.json({ success: true });
    }
    console.error('[cert/notify] insert error:', error.message);
    return NextResponse.json(
      { error: 'Service unavailable. Please try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}