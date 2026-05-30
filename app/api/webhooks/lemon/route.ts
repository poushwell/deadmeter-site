/**
 * app/api/webhooks/lemon/route.ts
 *
 * POST /api/webhooks/lemon
 *
 * Lemon Squeezy webhook handler.
 * TZ_04 §11.3: handles subscription_created, subscription_cancelled,
 *              order_created, subscription_payment_success,
 *              subscription_updated.
 *
 * Security: HMAC-SHA256 signature verification on every request.
 * TZ_04 §11.3: "Verify webhook signature" with LEMON_WEBHOOK_SECRET.
 *
 * Database writes (TZ_04 §11.3, schema.sql):
 *   subscription_created  → INSERT INTO subscriptions + UPDATE profiles.current_tier
 *   subscription_updated  → UPDATE subscriptions
 *   subscription_cancelled → UPDATE subscriptions (cancel_at_period_end = true)
 *   order_created (Pro/Scale/PAYG) → depends on product type
 *   order_created (Founder Lifetime) → INSERT INTO founder_lifetime
 *   order_created (PAYG pack)        → INSERT INTO payg_credits
 *
 * NOTE: Lemon Squeezy sends X-Signature header (not X-Signature-256).
 * Raw body must be read before any parsing (crypto.createHmac on text).
 *
 * This route is excluded from proxy.ts matcher — it does not need a session.
 */

import crypto from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ─── Types (Lemon Squeezy webhook payload shapes) ─────────────────────────────

interface LSMeta {
  event_name:    string;
  custom_data?: { user_id?: string; user_email?: string };
}

interface LSSubscriptionAttributes {
  status:                   string;   // active | cancelled | expired | past_due | paused | unpaid
  product_name:             string;
  variant_name:             string;   // 'Monthly' | 'Annual'
  customer_id:              number;
  order_id:                 number;
  subscription_id?:         number;
  user_email:               string;
  renews_at:                string | null;
  ends_at:                  string | null;
  cancelled:                boolean;
  billing_anchor:           number;
  created_at?:              string;   // ISO timestamp of subscription creation
  first_subscription_item?: { price_id?: number; variant_id?: number };
  total_formatted?:         string;
  total:                    number;   // cents
  currency:                 string;
}

interface LSOrderAttributes {
  product_name:   string;
  identifier:     string;   // order number
  user_email:     string;
  customer_id:    number;
  total:          number;   // cents
  currency:       string;
  status:         string;   // paid | refunded
  refunded:       boolean;
}

interface LSWebhookPayload {
  meta: LSMeta;
  data: {
    id:         string | number;
    type:       string;
    attributes: LSSubscriptionAttributes | LSOrderAttributes;
  };
}

// ─── Supabase service client ──────────────────────────────────────────────────
// Webhook has no user session — no cookies needed. Direct service client.

function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { get: () => undefined, set: () => {}, remove: () => {} },
    }
  );
}

// ─── Tier mapping ─────────────────────────────────────────────────────────────
// Maps Lemon Squeezy product names to DB subscription_tier enum values.
// Keep in sync with Lemon Squeezy product names + supabase/schema.sql enum.

function resolveTier(productName: string): string | null {
  const name = productName.toLowerCase();
  if (name.includes('pro')) return 'pro';
  if (name.includes('scale')) return 'scale';
  if (name.includes('researcher')) return 'researcher';
  if (name.includes('enterprise')) return 'enterprise';
  return null;
}

// ─── Helper: resolve user_id from email or custom_data ───────────────────────

async function resolveUserId(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  email: string,
  customUserId?: string
): Promise<string | null> {
  if (customUserId) return customUserId;

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  return data?.id ?? null;
}

// ─── Event handlers ───────────────────────────────────────────────────────────

// TZ_04 §11.3: subscription_created — new paying subscriber
async function handleSubscriptionCreated(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  payload: LSWebhookPayload
): Promise<void> {
  const attr = payload.data.attributes as LSSubscriptionAttributes;
  const email = attr.user_email?.toLowerCase().trim();
  if (!email) return;

  const userId = await resolveUserId(
    supabase,
    email,
    payload.meta.custom_data?.user_id
  );

  const tier = resolveTier(attr.product_name);
  if (!tier) {
    console.warn('[lemon] subscription_created: unknown product:', attr.product_name);
    return;
  }

  const period = attr.variant_name?.toLowerCase().includes('annual') ? 'annual' : 'monthly';

  // Insert subscription row
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id:               userId,
        lemon_subscription_id: String(payload.data.id),
        lemon_order_id:        String(attr.order_id),
        lemon_customer_id:     String(attr.customer_id),
        tier,
        period,
        status:                'active',
        amount_usd:            Number(attr.total ?? 0) / 100,
        currency:              attr.currency ?? 'USD',
        current_period_start:  attr.created_at ?? new Date().toISOString(),
        current_period_end:    attr.renews_at ?? attr.ends_at,
        cancel_at_period_end:  false,
      },
      { onConflict: 'lemon_subscription_id' }
    );

  if (subError) {
    console.error('[lemon] subscription_created insert error:', subError.message);
    return;
  }

  // Update profile current_tier
  if (userId) {
    await supabase
      .from('profiles')
      .update({ current_tier: tier })
      .eq('id', userId);
  }
}

// TZ_04 §11.3: subscription_updated — tier change, renewal, status change
async function handleSubscriptionUpdated(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  payload: LSWebhookPayload
): Promise<void> {
  const attr = payload.data.attributes as LSSubscriptionAttributes;

  // Map LS status → DB status
  // DB subscription_status enum: pending | active | cancelled | expired | paused
  // Maps LS statuses → DB enum values
  // past_due / unpaid → 'paused' (payment failed, in grace period — closest DB state)
  const statusMap: Record<string, string> = {
    active:    'active',
    cancelled: 'cancelled',
    expired:   'expired',
    past_due:  'paused',   // LS grace period → DB paused
    paused:    'paused',
    unpaid:    'paused',   // LS unpaid → DB paused (payment failed state)
    on_trial:  'active',
  };
  const dbStatus = statusMap[attr.status] ?? attr.status;

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status:               dbStatus,
      current_period_end:   attr.renews_at ?? attr.ends_at,
      cancel_at_period_end: attr.cancelled ?? false,
      cancelled_at:         attr.cancelled && attr.ends_at ? attr.ends_at : null,
    })
    .eq('lemon_subscription_id', String(payload.data.id));

  if (error) {
    console.error('[lemon] subscription_updated error:', error.message);
  }
}

// TZ_04 §11.3: subscription_cancelled — end of billing cycle
async function handleSubscriptionCancelled(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  payload: LSWebhookPayload
): Promise<void> {
  const attr = payload.data.attributes as LSSubscriptionAttributes;

  const { data: sub } = await supabase
    .from('subscriptions')
    .update({
      status:               'cancelled',
      cancel_at_period_end: true,
      cancelled_at:         new Date().toISOString(),
    })
    .eq('lemon_subscription_id', String(payload.data.id))
    .select('user_id')
    .maybeSingle();

  // Downgrade profile tier when subscription ends
  if (sub?.user_id) {
    await supabase
      .from('profiles')
      .update({ current_tier: 'free' })
      .eq('id', sub.user_id);
  }
}

// TZ_04 §11.3, TZ_03 §6.6: order_created (Founder Lifetime)
async function handleFounderLifetimeOrder(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  payload: LSWebhookPayload
): Promise<void> {
  const attr = payload.data.attributes as LSOrderAttributes;
  if (attr.refunded) return; // ignore refunded orders

  const email = attr.user_email?.toLowerCase().trim();
  if (!email) return;

  const userId = await resolveUserId(
    supabase,
    email,
    payload.meta.custom_data?.user_id
  );

  // INSERT INTO founder_lifetime — trigger enforces 200-cap
  const { error: founderError } = await supabase
    .from('founder_lifetime')
    .insert({
      user_id:        userId,
      email,
      lemon_order_id: String(payload.data.id),
      amount_usd:     Number(attr.total ?? 0) / 100,
      display_publicly: false,  // default — user can opt-in via profile settings
    });

  if (founderError) {
    // Check for cap exceeded
    if (founderError.message?.includes('founder_lifetime_cap_exceeded')) {
      console.error('[lemon] founder_lifetime cap reached — order:', payload.data.id);
      // TODO: notify Pavel — all 200 spots taken
      return;
    }
    console.error('[lemon] founder_lifetime insert error:', founderError.message);
    return;
  }

  // Founder Lifetime grants Pro features — set current_tier = 'pro'
  // 'founder' is NOT in subscription_tier enum; founder status is tracked
  // separately in the founder_lifetime table (already inserted above).
  if (userId) {
    await supabase
      .from('profiles')
      .update({ current_tier: 'pro' })
      .eq('id', userId);
  }
}

// PAYG credit packs — TZ_03 §6.5, schema payg_credits
async function handlePaygOrder(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  payload: LSWebhookPayload,
  packType: 'starter' | 'bulk'
): Promise<void> {
  const attr = payload.data.attributes as LSOrderAttributes;
  if (attr.refunded) return;

  const email = attr.user_email?.toLowerCase().trim();
  if (!email) return;

  const userId = await resolveUserId(
    supabase,
    email,
    payload.meta.custom_data?.user_id
  );

  const creditsTotal = packType === 'starter' ? 100 : 1000;
  const yearsValid   = packType === 'starter' ? 1   : 2;
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + yearsValid);

  const { error } = await supabase
    .from('payg_credits')
    .insert({
      user_id:           userId,
      lemon_order_id:    String(payload.data.id),
      pack_type:         packType,
      credits_total:     creditsTotal,
      credits_remaining: creditsTotal,
      amount_usd:        Number(attr.total ?? 0) / 100,
      expires_at:        expiresAt.toISOString(),
    });

  if (error) {
    console.error(`[lemon] payg_credits insert error (${packType}):`, error.message);
  }
}

// ─── POST /api/webhooks/lemon ─────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {

  // ── 1. Read raw body first (must happen before any parsing) ───────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Cannot read body' }, { status: 400 });
  }

  // ── 2. Verify HMAC-SHA256 signature ───────────────────────────────────────
  // TZ_04 §11.3: "Verify webhook signature" — reject anything not from LS
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[lemon] LEMON_SQUEEZY_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = request.headers.get('X-Signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── 3. Parse payload ──────────────────────────────────────────────────────
  let payload: LSWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LSWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  if (!eventName) {
    return NextResponse.json({ error: 'Missing event_name' }, { status: 400 });
  }

  console.info(`[lemon] event: ${eventName}`, { id: payload.data?.id });

  // ── 4. Route event to handler ─────────────────────────────────────────────
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[lemon] SUPABASE_SERVICE_ROLE_KEY not set — cannot process webhook');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
  const supabase = createServiceClient();
  const productName = (payload.data?.attributes as LSOrderAttributes)?.product_name ?? '';

  try {
    switch (eventName) {

      case 'subscription_created':
        await handleSubscriptionCreated(supabase, payload);
        break;

      case 'subscription_updated':
      case 'subscription_payment_success':
        await handleSubscriptionUpdated(supabase, payload);
        break;

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(supabase, payload);
        break;

      case 'order_created': {
        const nameLower = productName.toLowerCase();
        if (nameLower.includes('founder lifetime')) {
          await handleFounderLifetimeOrder(supabase, payload);
        } else if (nameLower.includes('starter pack')) {
          await handlePaygOrder(supabase, payload, 'starter');
        } else if (nameLower.includes('bulk pack')) {
          await handlePaygOrder(supabase, payload, 'bulk');
        } else {
          // Regular subscription order — subscription_created handles tier update
          console.info('[lemon] order_created: delegating to subscription flow');
        }
        break;
      }

      case 'order_refunded': {
        // Refund within 14-day window — downgrade profile + cancel subscription
        const attr = payload.data.attributes as LSOrderAttributes;
        const email = attr.user_email?.toLowerCase().trim();
        if (email) {
          const userId = await resolveUserId(supabase, email);
          if (userId) {
            // Downgrade profile tier
            await supabase
              .from('profiles')
              .update({ current_tier: 'free' })
              .eq('id', userId);

            // Mark active subscriptions as cancelled for this user
            // (keeps DB consistent: status=cancelled matches tier=free)
            await supabase
              .from('subscriptions')
              .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
              .eq('user_id', userId)
              .eq('status', 'active');
          }
        }
        break;
      }

      default:
        // Unknown events — log and acknowledge (don't error, LS will retry)
        console.info(`[lemon] unhandled event: ${eventName}`);
    }
  } catch (err) {
    console.error(`[lemon] handler error for ${eventName}:`, err);
    // Return 500 so Lemon Squeezy retries delivery
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  // ── 5. Acknowledge ────────────────────────────────────────────────────────
  // Lemon Squeezy expects 200 to confirm delivery.
  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}