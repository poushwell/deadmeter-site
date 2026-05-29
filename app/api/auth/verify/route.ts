/**
 * app/api/auth/verify/route.ts
 *
 * GET /api/auth/verify
 *
 * TZ_02 §1.1 specifies this path. Delegates to /auth/callback
 * which contains the actual PKCE code exchange logic.
 *
 * Supabase emailRedirectTo points to /auth/callback directly,
 * but this route exists for TZ compliance and any direct links.
 */

import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest): NextResponse {
  const { searchParams } = new URL(request.url);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com';

  // Forward all query params (code, next) to the actual callback handler
  return NextResponse.redirect(
    `${base}/auth/callback?${searchParams.toString()}`
  );
}