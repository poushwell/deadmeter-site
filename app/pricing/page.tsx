/**
 * app/pricing/page.tsx — Server Component
 *
 * Exports metadata (TZ_03 §6.1), fetches Founder counter live,
 * renders PricingClient with founderRemaining prop.
 *
 * TZ_03 §6.1 meta, §6.2 schema
 * TZ_04 §8.4: get_founder_lifetime_remaining() called on page load
 */

import type { Metadata } from 'next';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { createServerClient } from '@supabase/ssr';
import { PricingClient } from './PricingClient';

export const metadata: Metadata = buildMetadata({
  title: 'Pricing',
  description:
    'Free tier with 30 monthly Cert. Pro $19/month for unlimited use. Pay-as-you-go credit packs from $19. Founder Lifetime $99 once, limited to 200 supporters.',
  path: '/pricing',
});

// Schema — TZ_03 §6.2 verbatim
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Deadmeter Pro',
  description: 'Unlimited access to all Deadmeter tools and API.',
  offers: [
    {
      '@type': 'Offer',
      price: '19',
      priceCurrency: 'USD',
      billingDuration: 'P1M',
      name: 'Pro Monthly',
    },
    {
      '@type': 'Offer',
      price: '179',
      priceCurrency: 'USD',
      billingDuration: 'P1Y',
      name: 'Pro Annual',
    },
  ],
};

// Fetch live Founder counter — TZ_04 §8.4
// Uses anon client (SECURITY DEFINER function is public).
// Falls back to null on error so page still renders.
async function getFounderRemaining(): Promise<number | null> {
  try {
    // Uses service role — function has no GRANT EXECUTE to anon in schema.
    // Service role bypasses RLS and can call SECURITY DEFINER functions.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { get: () => undefined, set: () => {}, remove: () => {} } }
    );
    const { data, error } = await supabase
      .rpc('get_founder_lifetime_remaining');
    if (error) {
      console.error('[pricing] founder RPC error:', error.message);
      return null;
    }
    // data is INTEGER from SQL function
    const val = typeof data === 'number' ? data : Number(data);
    return Number.isFinite(val) ? Math.max(0, val) : null;
  } catch (err) {
    console.error('[pricing] founder fetch failed:', err);
    return null;
  }
}

export default async function PricingPage() {
  const founderRemaining = await getFounderRemaining();

  return (
    <>
      <SchemaMarkup schema={schema} />
      <PricingClient founderRemaining={founderRemaining} />
    </>
  );
}