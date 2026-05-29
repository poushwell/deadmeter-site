/**
 * app/api/auth/signout/route.ts
 *
 * POST /api/auth/signout
 *
 * Signs the current user out by invalidating the Supabase session.
 * Called by the avatar dropdown "Sign out" button in the Header
 * (TZ_02 §2.1: "avatar dropdown когда logged in").
 *
 * Returns JSON so the client can redirect after receiving success.
 * Note: this route is not listed explicitly in TZ_02 §1.1 folder structure
 * but is required for the "avatar dropdown" sign-out flow.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_request: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[signout] error:', error.message);
    return NextResponse.json(
      { error: 'Sign out failed. Please try again.' },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}