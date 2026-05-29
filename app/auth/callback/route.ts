/**
 * app/auth/callback/route.ts
 *
 * GET /auth/callback
 *
 * Supabase redirects here after the user clicks the magic link.
 * Exchanges the PKCE auth code for a session cookie.
 *
 * URL format from Supabase:
 *   /auth/callback?code=<pkce-auth-code>[&next=<redirect-path>]
 *
 * After session is created, redirects to:
 *   - 'next' param if provided and is a safe relative path
 *   - '/' otherwise
 *
 * NOTE: this route lives at app/auth/callback/ (NOT app/api/auth/).
 * TZ_02 §1.1 lists app/api/auth/verify/ but the Supabase convention
 * and emailRedirectTo in magic-link use /auth/callback — this location
 * is correct and consistent with @supabase/ssr documentation.
 *
 * TZ_04 §9.3: emailRedirectTo = NEXT_PUBLIC_SITE_URL + /auth/callback
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Prevent open-redirect: only allow relative paths.
  // Explicitly block protocol-relative URLs ('//evil.com' starts with '/')
  const safeNext =
    next.startsWith('/') && !next.startsWith('//') ? next : '/';

  // Use NEXT_PUBLIC_SITE_URL for redirect base — avoids issues with
  // x-forwarded-host on Vercel where request.url origin may differ
  // from the public-facing URL.
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com';

  if (!code) {
    // No code — stale or malformed link
    return NextResponse.redirect(`${base}/?auth_error=1`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession:', error.message);
    return NextResponse.redirect(`${base}/?auth_error=1`);
  }

  return NextResponse.redirect(`${base}${safeNext}`);
}