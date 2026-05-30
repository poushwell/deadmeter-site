/**
 * app/api/notify/route.ts
 *
 * POST /api/notify  { email: string, tool: string }
 *
 * Saves email to tool_notify table for coming-soon tool waitlist.
 * Called by NotifyForm component on per-tool pages.
 *
 * Behaviour:
 * - Valid (email, tool) pair → upsert into tool_notify.
 *   ON CONFLICT (email, tool_name) DO NOTHING — idempotent.
 * - Returns 200 { success: true } regardless of whether it was already present
 *   (no enumeration — don't reveal if email is already on the list).
 * - Returns 422 on validation failure, 503 on database error.
 *
 * TZ_04 §8.2: tool_notify table — (email, tool_name, signed_up_at, launch_notified)
 * TZ_02 §5.3: NotifyForm calls POST /api/notify
 * TZ_04 §19.2: at tool launch, email the notify list
 *
 * Tool names must match the CHECK constraint in supabase/schema.sql.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ─── Tool name mapping ────────────────────────────────────────────────────────
// NotifyForm sends the display name (e.g. "Writing DNA") from content.toolName.
// The DB CHECK constraint requires slugs (e.g. "writing-dna").
// We accept both display names and slugs, mapping display names to slugs here.
// Must stay in sync with CHECK constraint in supabase/schema.sql tool_notify.

type ToolSlug =
  | 'writing-dna'
  | 'ai-text-checker'
  | 'code-dna'
  | 'bs-meter'
  | 'dead-internet-index'
  | 'ai-flattener'
  | 'aeo-checker'
  | 'phylogeny';

// Maps display names (sent by NotifyForm) → DB slugs
const DISPLAY_TO_SLUG: Record<string, ToolSlug> = {
  // Display names — from content.toolName in per-tool pages
  'Writing DNA':          'writing-dna',
  'AI Text Checker':      'ai-text-checker',
  'Code DNA':             'code-dna',
  'BS Meter':             'bs-meter',
  'Dead Internet Index':  'dead-internet-index',
  'AI Flattener':         'ai-flattener',
  'AEO Checker':          'aeo-checker',
  'Phylogeny':            'phylogeny',
  // Slugs also accepted directly (for any future callers)
  'writing-dna':          'writing-dna',
  'ai-text-checker':      'ai-text-checker',
  'code-dna':             'code-dna',
  'bs-meter':             'bs-meter',
  'dead-internet-index':  'dead-internet-index',
  'ai-flattener':         'ai-flattener',
  'aeo-checker':          'aeo-checker',
  'phylogeny':            'phylogeny',
};

/**
 * Resolves a display name or slug to a DB slug.
 * Returns null if the value is not a known tool.
 */
function resolveToolSlug(value: unknown): ToolSlug | null {
  if (typeof value !== 'string') return null;
  return DISPLAY_TO_SLUG[value.trim()] ?? null;
}

// ─── Postgres error codes ─────────────────────────────────────────────────────

const PG_UNIQUE_VIOLATION = '23505';

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  if (value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

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

// ─── POST /api/notify ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // ── 1. Parse ────────────────────────────────────────────────────────────────

  let rawEmail: unknown;
  let rawTool: unknown;

  try {
    const body = await request.json() as Record<string, unknown>;
    rawEmail = body.email;
    rawTool  = body.tool;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── 2. Validate ─────────────────────────────────────────────────────────────

  if (typeof rawEmail !== 'string' || rawEmail.trim() === '') {
    return NextResponse.json({ error: 'Email is required' }, { status: 422 });
  }

  const email = rawEmail.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 422 });
  }

  const toolSlug = resolveToolSlug(rawTool);
  if (!toolSlug) {
    return NextResponse.json({ error: 'Invalid tool name' }, { status: 422 });
  }

  // ── 3. Insert ───────────────────────────────────────────────────────────────

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from('tool_notify')
    .insert({
      email,
      tool_name: toolSlug,
      signed_up_at: new Date().toISOString(),
      launch_notified: false,
    });

  if (error) {
    // Duplicate (email, tool_name) — already on the list, treat as success.
    // This keeps the response identical whether the email is new or existing
    // so the form never reveals whether an email was already registered.
    if (error.code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json({ success: true });
    }

    console.error('[notify] insert error:', error.message);
    return NextResponse.json(
      { error: 'Service unavailable. Please try again.' },
      { status: 503 }
    );
  }

  // ── 4. Respond ──────────────────────────────────────────────────────────────

  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}