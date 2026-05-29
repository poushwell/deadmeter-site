/**
 * lib/supabase/client.ts
 *
 * Supabase browser client for Client Components.
 * TZ_04 §8.3
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}