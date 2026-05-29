/**
 * proxy.ts  (корень проекта, рядом с app/)
 *
 * Next.js 16: файл переименован из middleware.ts → proxy.ts,
 * функция переименована из middleware → proxy.
 *
 * Обновляет Supabase-сессию на каждом запросе чтобы access token
 * оставался актуальным. Без этого файла сессия протухает.
 *
 * Не блокирует неаутентифицированных пользователей — на launch
 * нет защищённых страниц. Proxy только поддерживает сессию.
 *
 * matcher исключает статику, /api/webhooks/* и публичные ассеты.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: object) {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
        },
        remove(name: string, options: object) {
          request.cookies.set(name, '');
          response = NextResponse.next({ request });
          response.cookies.set(name, '', {
            ...(options as Parameters<typeof response.cookies.set>[2]),
            maxAge: 0,
          });
        },
      },
    }
  );

  // Validates JWT server-side and refreshes the access token cookie if expired.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|site\\.webmanifest|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};