/**
 * app/api/cert/route.ts
 *
 * POST /api/cert
 *
 * Proxy to Pavel's Framework Desktop via Cloudflare Tunnel.
 * TZ_04 §10.3: Next.js frontend proxies all cert requests to backend.
 * TZ_04 §10.4: Vercel Pro timeout = 60s — matches cert latency 30-60s.
 * TZ_04 §10.5: Backend may be unavailable — handle gracefully.
 *
 * Request body: FormData with fields:
 *   mode  — 'text' | 'url' | 'file'
 *   text  — raw text (when mode=text)
 *   url   — article URL (when mode=url)
 *   file  — uploaded file blob (when mode=file)
 *
 * On success the backend returns JSON matching cert_results schema columns:
 *   { hash, ims_text, ci_low, ci_high, verbal_label,
 *     methodology_version, methodology_hash, signed_payload, text_excerpt }
 * The backend saves the result to cert_results. Frontend only reads the hash.
 *
 * Mock mode (BACKEND_API_URL not set):
 * - Returns mock JSON AND inserts a row into cert_results so that
 *   /cert/[hash] renders correctly without the backend.
 *
 * TODO: remove mock block once BACKEND_API_URL is configured in Vercel.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// TZ_04 §10.4: Vercel Pro allows 60s. Cert takes 30-60s. Must be set explicitly.
export const maxDuration = 60;

// ─── Supabase service client (no cookies — server-only) ───────────────────────

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => undefined, set: () => {}, remove: () => {} } }
  );
}

// ─── Mock mode helpers ────────────────────────────────────────────────────────

function buildMockHash(): string {
  // 12 chars: "m" + 11 random alphanumeric — matches cert_results.hash spec
  return 'm' + Math.random().toString(36).slice(2, 13).padEnd(11, '0');
}

async function saveMockResult(
  hash: string,
  mode: string
): Promise<void> {
  // Only attempt if service role key is available
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const supabase = createServiceClient();
  await supabase.from('cert_results').insert({
    hash,
    input_mode:          mode,
    text_excerpt:        mode === 'url'
      ? 'URL content extraction — mock excerpt for development.'
      : 'This is a mock excerpt for development purposes only.',
    ims_text:            42.3,
    ci_low:              37.1,
    ci_high:             47.5,
    verbal_label:        'Hybrid',
    methodology_version: 'v1.0',
    methodology_hash:    '4F7A2C91',
    signed_payload:      null,
  });
  // Errors logged but not thrown — mock insert failure is non-fatal
}

// ─── POST /api/cert ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const backendUrl = process.env.BACKEND_API_URL;

  // ── Mock mode ──────────────────────────────────────────────────────────────
  // TODO: remove this block once BACKEND_API_URL is set in Vercel env vars
  if (!backendUrl) {
    await new Promise((r) => setTimeout(r, 2000)); // simulate latency

    let mode = 'text';
    try {
      const fd = await request.formData();
      mode = fd.get('mode')?.toString() ?? 'text';
    } catch {
      // non-multipart request in mock — default to text mode
    }

    const hash = buildMockHash();

    // Save to cert_results so /cert/[hash] renders correctly in dev
    await saveMockResult(hash, mode);

    return NextResponse.json({
      hash,
      ims_text:            42.3,
      ci_low:              37.1,
      ci_high:             47.5,
      verbal_label:        'Hybrid',
      methodology_version: 'v1.0',
      methodology_hash:    '4F7A2C91',
      signed_payload:      null,
      text_excerpt:        mode === 'url'
        ? 'URL content extraction — mock excerpt for development.'
        : 'This is a mock excerpt for development purposes only.',
    });
  }

  // ── Real proxy to Cloudflare Tunnel ───────────────────────────────────────
  // TZ_04 §10.3: forward FormData as-is to the backend

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request — expected multipart/form-data.' },
      { status: 400 }
    );
  }

  const backendHeaders: Record<string, string> = {};
  const apiKey = process.env.BACKEND_API_KEY;
  if (apiKey) backendHeaders['X-API-Key'] = apiKey;

  try {
    const backendResponse = await fetch(`${backendUrl}/v1/cert`, {
      method:  'POST',
      headers: backendHeaders,
      body:    formData,
    });

    if (!backendResponse.ok) {
      const status = backendResponse.status;
      console.error('[api/cert] backend error:', status);

      // Pass through backend validation errors (e.g. non-English, too short)
      if (status === 422) {
        const data = await backendResponse.json().catch(() => ({}));
        return NextResponse.json(data, { status: 422 });
      }

      return NextResponse.json(
        { error: 'The Death Certificate service is temporarily unavailable. Please try again in a few minutes.' },
        { status: 503 }
      );
    }

    // Backend is responsible for saving to cert_results — we only return the result
    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (err) {
    // TZ_04 §10.5: network error (tunnel down, backend offline)
    console.error('[api/cert] fetch error:', err);
    return NextResponse.json(
      { error: 'The Death Certificate service is temporarily unavailable. Please try again in a few minutes.' },
      { status: 503 }
    );
  }
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}