/**
 * app/api/auth/magic-link/route.ts
 *
 * POST /api/auth/magic-link
 *
 * Sends a magic link (OTP) to the provided email via Supabase Auth.
 * Supabase delivers the email through Resend — configured by Pavel
 * in Supabase Dashboard: Auth → Settings → SMTP (TZ_04 §9.3).
 *
 * After the user clicks the link, Supabase redirects to /auth/callback
 * which is handled by app/auth/callback/route.ts.
 *
 * Used by:
 *   - "Sign in" button in Header (TZ_02 §2.1)
 *   - "Sign up free" CTA on /pricing (TZ_02 §6.7)
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // 1. Parse
  let rawEmail: unknown;
  try {
    const body: unknown = await request.json();
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    ({ email: rawEmail } = body as Record<string, unknown>);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 2. Validate
  if (typeof rawEmail !== 'string' || rawEmail.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 });
  }

  const email = rawEmail.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }

  // 3. Send OTP — Supabase emails the magic link via Resend (Pavel's SMTP config)
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Supabase appends ?code=<pkce-code> to this URL.
      // Route: app/auth/callback/route.ts
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com'}/auth/callback`,
    },
  });

  if (error) {
    console.error('[magic-link] Supabase OTP error:', error.message);
    return NextResponse.json(
      { error: 'Service unavailable. Please try again.' },
      { status: 503 }
    );
  }

  // Always return success — do not reveal whether this email has an account.
  // (Email enumeration protection)
  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}