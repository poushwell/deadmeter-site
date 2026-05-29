/**
 * lib/supabase/server.ts
 *
 * Supabase server-side client for Route Handlers and Server Components.
 * Next.js 15+: cookies() is async — must be awaited.
 *
 * cookies() returns ReadonlyRequestCookies at the TypeScript level,
 * but at runtime in Route Handlers the object IS mutable.
 * The cast via (cookieStore as any) is intentional: it allows .set()
 * to work in Route Handlers while the try/catch silently swallows the
 * error in Server Components where the cookie store is truly read-only.
 *
 * This pattern matches the official @supabase/ssr documentation for
 * Next.js App Router.
 *
 * TZ_04 §8.3
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Must be awaited: `const supabase = await createClient()` */
export async function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookieStore = await cookies() as any;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: object) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // In Server Components, cookies() is read-only.
            // Session token refresh is handled by middleware instead.
          }
        },
        remove(name: string, options: object) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch {
            // Same as above.
          }
        },
      },
    }
  );
}