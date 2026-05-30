/**
 * app/pricing/PricingClient.tsx — Client Component
 *
 * All interactive logic (billing toggle) lives here.
 * Imported by app/pricing/page.tsx (Server Component).
 *
 * TZ_02 §6 — structure, layout, anti-patterns
 * TZ_03 §6.3–§6.8 — all texts verbatim
 * TZ_05 Part 2 §1.3 — tier card CSS spec
 * TZ_05 Part 1 — buttons, colors, spacing
 *
 * TODO (Lemon Squeezy): replace href="#" on all checkout buttons
 *      with real URLs when Pavel creates products in LS dashboard.
 * founderRemaining prop: live count from get_founder_lifetime_remaining() RPC (TZ_04 §8.4).
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQBlock } from '@/components/shared/FAQBlock';

// ─── FAQ (TZ_03 §6.8 verbatim) ───────────────────────────────────────────────

const faqItems = [
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. Monthly subscriptions cancel anytime with no refund for the current period. Annual subscriptions get prorated refunds for unused months. Lifetime has 14-day money-back, then non-refundable.',
  },
  {
    question: 'Do you accept crypto?',
    answer:
      'Yes, for annual subscriptions only. CryptoCloud handles USDT (TRC-20) and USDC (ERC-20). Annual subs paid in crypto get the same 22% annual discount.',
  },
  {
    question: 'Do you offer team plans?',
    answer:
      'Not in v1.0. Self-serve team plans are planned for Year 2 if demand validates. For team needs now, contact us about Enterprise.',
  },
  {
    question: 'Can I upgrade or downgrade?',
    answer:
      'Yes. Upgrade is immediate with prorated charge. Downgrade takes effect at next billing cycle.',
  },
  {
    question: 'Is API included in Pro?',
    answer:
      'Yes. Pro includes 1,000 API requests per day. Scale increases this to 10,000 per day. Free tier does not include API access.',
  },
  {
    question: 'What happens if I exceed Pro limits?',
    answer:
      'Pro is unlimited for normal individual use. The infrastructure caps natural at hundreds of paying users per machine. Exceeding Pro limits has not happened in practice. Contact us if you anticipate unusual usage.',
  },
  {
    question: 'Why is Twitter not included in Pulse?',
    answer:
      'Twitter API access requires enterprise pricing tier above our operating budget. The decision to drop Twitter from v1.0 streams is documented in the methodology page.',
  },
  {
    question: 'What is the Founder Lifetime cap based on?',
    answer:
      '200 spots provides bootstrap funding while bounding long-term liability. The cap is final and will not increase. After 200 spots are taken, the tier closes and does not relist.',
  },
];

// ─── Shared ───────────────────────────────────────────────────────────────────

const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] ' +
  '[text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] ' +
  'hover:decoration-[var(--text-primary)] transition-colors';

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-baseline gap-2 text-[15px] text-[var(--text-primary)] leading-[1.50] py-[10px] border-b border-[var(--border)]">
      <span className="shrink-0 text-[12px]" style={{ color: 'var(--accent)' }} aria-hidden="true">
        ✓
      </span>
      {text}
    </li>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PricingClientProps {
  /** Live count from get_founder_lifetime_remaining(). Null = RPC failed (show fallback). */
  founderRemaining: number | null;
}

export function PricingClient({ founderRemaining }: PricingClientProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <main id="main-content">

      {/* ── HERO ────────────────────────────────────────────────────────────
          TZ_03 §6.3: H1 "Pricing", subtitle verbatim
          TZ_05 Part 2 §1.3: eyebrow "/ Pricing /", 80px padding
      ────────────────────────────────────────────────────────────────────── */}
      <section aria-labelledby="pricing-heading" className="border-b border-[var(--border)]">
        <div className="container pt-[80px] md:pt-[100px] pb-[56px] md:pb-[64px]">
          <div className="max-w-[640px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-6">
              / Pricing /
            </p>
            <h1
              id="pricing-heading"
              className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-5"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            >
              Pricing
            </h1>
            <p className="text-[19px] text-[var(--text-secondary)] leading-[1.55]">
              Free tier covers casual use. Pro covers professional workflows. Lifetime covers early supporters once.
            </p>
          </div>
        </div>
      </section>


      {/* ── PLANS ───────────────────────────────────────────────────────────
          TZ_03 §6.4: all tier texts verbatim
          TZ_02 §6.3: 4 cards horizontal desktop / 2×2 tablet / stack mobile
          TZ_02 §6.4: card structure [name][badge][price][period][tagline][features][CTA]
          TZ_02 §6.6: toggle above tier matrix, default monthly
          TZ_05 Part 2 §1.3: .tier-card CSS, recommended gets accent border 2px
                              padding compensated: 39px 31px (40px - 1px each side)
      ────────────────────────────────────────────────────────────────────── */}
      <section
        id="plans"
        aria-labelledby="plans-heading"
        className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
      >
        <div className="container">

          <h2
            id="plans-heading"
            className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-10"
          >
            Plans
          </h2>

          {/* Toggle — TZ_02 §6.6: above matrix, default monthly */}
          <div
            className="inline-flex mb-10"
            role="group"
            aria-label="Billing period"
          >
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              aria-pressed={billing === 'monthly'}
              className={[
                'px-5 py-2 text-[13px] font-medium transition-colors border',
                billing === 'monthly'
                  ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Monthly
            </button>
            {/* -ml-px joins the buttons without gap; no border-l-0 so active state is complete */}
            <button
              type="button"
              onClick={() => setBilling('annual')}
              aria-pressed={billing === 'annual'}
              className={[
                '-ml-px px-5 py-2 text-[13px] font-medium transition-colors border',
                billing === 'annual'
                  ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              Annual
              <span
                className="ml-2 font-mono text-[10px] uppercase tracking-[0.06em]"
                style={{ color: billing === 'annual' ? 'var(--bg)' : 'var(--live)' }}
              >
                save 22%
              </span>
            </button>
          </div>

          {/* 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* ── FREE ──────────────────────────────────────────────────── */}
            <article
              className="flex flex-col border border-[var(--border)] bg-[var(--paper)] py-10 px-8"
              aria-label="Free plan"
            >
              <h3 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-4">
                Free
              </h3>
              <p
                className="font-mono text-[56px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                $0
              </p>
              <p className="text-[14px] text-[var(--text-tertiary)] mb-8">forever</p>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-6">
                Most everything works.
              </p>
              <ul className="flex-grow mb-8" role="list">
                {[
                  '30 Death Certificate per month with account',
                  '50 Tools usage per month with account',
                  'Pulse weekly publication, full archive',
                  'Pulse RSS feed',
                  'Community support',
                ].map((t) => (
                  <Feature key={t} text={t} />
                ))}
              </ul>
              {/*
                TZ_02 §6.7: "Sign up free" → /api/auth/magic-link signup flow
                TODO: wire to magic-link auth modal when Header sign-in
                      form component is built. href="#" prevents 405 error.
              */}
              <Link
                href="#"
                className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Sign up free
              </Link>
            </article>

            {/* ── PRO ───────────────────────────────────────────────────── */}
            {/*
              TZ_05 Part 2 §1.3: recommended card border 2px accent,
              padding compensated to 39px vertical / 31px horizontal
              (40px - 1px = 39px top/bottom; 32px - 1px = 31px left/right)
            */}
            <article
              className="flex flex-col relative bg-[var(--paper)]"
              style={{ border: '2px solid var(--accent)', padding: '39px 31px' }}
              aria-label="Pro plan, most popular"
            >
              <span className="absolute -top-px left-6 font-mono text-[10px] uppercase tracking-[0.10em] bg-[var(--accent)] text-white px-3 py-1">
                Most popular
              </span>
              <h3 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-4 mt-4">
                Pro
              </h3>
              {/* Price changes with toggle — TZ_02 §6.6 */}
              <p
                className="font-mono text-[56px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                {billing === 'monthly' ? '$19' : '$179'}
              </p>
              <p className={`text-[14px] text-[var(--text-tertiary)] ${billing === 'annual' ? 'mb-1' : 'mb-8'}`}>
                {billing === 'monthly' ? 'per month' : 'per year (save 22%)'}
              </p>
              {billing === 'annual' && (
                <p className="text-[13px] text-[var(--text-secondary)] mb-4">
                  $14.92/mo effective
                </p>
              )}
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-6 mt-2">
                For professional workflows.
              </p>
              <ul className="flex-grow mb-8" role="list">
                {[
                  'Unlimited Death Certificate',
                  'Unlimited Tools usage',
                  'API access (1,000 requests per day)',
                  'Priority email support',
                  'Bulk upload up to 10 documents',
                ].map((t) => (
                  <Feature key={t} text={t} />
                ))}
              </ul>
              {/* TODO: replace href with Lemon Squeezy checkout URL */}
              <Link
                href="#"
                className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                Subscribe Pro
              </Link>
            </article>

            {/* ── SCALE ─────────────────────────────────────────────────── */}
            {/* Scale is monthly-only per TZ_03 §6.4 — price does not change with toggle */}
            <article
              className="flex flex-col border border-[var(--border)] bg-[var(--paper)] py-10 px-8"
              aria-label="Scale plan"
            >
              <h3 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-4">
                Scale
              </h3>
              <p
                className="font-mono text-[56px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                $79
              </p>
              <p className="text-[14px] text-[var(--text-tertiary)] mb-8">per month</p>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-6">
                For high-volume API use.
              </p>
              <ul className="flex-grow mb-8" role="list">
                {[
                  'Everything in Pro',
                  'API access (10,000 requests per day)',
                  'Bulk upload up to 50 documents',
                  'Priority response on issues',
                ].map((t) => (
                  <Feature key={t} text={t} />
                ))}
              </ul>
              {/* TODO: replace href with Lemon Squeezy checkout URL */}
              <Link
                href="#"
                className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Subscribe Scale
              </Link>
            </article>

            {/* ── ENTERPRISE ────────────────────────────────────────────── */}
            <article
              className="flex flex-col border border-[var(--border)] bg-[var(--paper)] py-10 px-8"
              aria-label="Enterprise plan"
            >
              <h3 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-4">
                Enterprise
              </h3>
              <p
                className="font-mono text-[40px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                $199
              </p>
              <p className="text-[14px] text-[var(--text-tertiary)] mb-8">
                starting at · per month
              </p>
              <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55] mb-6">
                For institutional needs.
              </p>
              <ul className="flex-grow mb-8" role="list">
                {[
                  'Custom rate limits',
                  'Custom SLA up to 99%',
                  'Account manager',
                  'Custom contracts and invoicing',
                ].map((t) => (
                  <Feature key={t} text={t} />
                ))}
              </ul>
              <a
                href="mailto:enterprise@deadmeter.com"
                className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Contact us for Enterprise
              </a>
            </article>

          </div>
        </div>
      </section>


      {/* ── PAY AS YOU GO ───────────────────────────────────────────────────
          TZ_03 §6.5 verbatim
          TZ_02 §6.2 section 5: 2 cards
      ────────────────────────────────────────────────────────────────────── */}
      <section
        id="payg"
        aria-labelledby="payg-heading"
        className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
      >
        <div className="container">
          <div className="max-w-[800px]">
            <h2
              id="payg-heading"
              className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-4"
            >
              Pay as you go
            </h2>
            <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-10">
              For occasional use without subscription.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

              <article
                className="flex flex-col border border-[var(--border)] bg-[var(--paper)] p-8"
                aria-label="Starter pack"
              >
                <h3 className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-4">
                  Starter Pack
                </h3>
                <p
                  className="font-mono text-[48px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                  style={{ fontFeatureSettings: '"tnum" 1' }}
                >
                  $19
                </p>
                <p className="text-[14px] text-[var(--text-tertiary)] mb-8">once</p>
                <ul className="flex-grow mb-8" role="list">
                  {[
                    '100 Death Certificate credits',
                    'Valid 1 year',
                    'Effective $0.19 per Cert',
                  ].map((t) => (
                    <Feature key={t} text={t} />
                  ))}
                </ul>
                {/* TODO: replace href with Lemon Squeezy checkout URL */}
                <Link
                  href="#"
                  className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
                >
                  Buy starter
                </Link>
              </article>

              <article
                className="flex flex-col border border-[var(--border)] bg-[var(--paper)] p-8"
                aria-label="Bulk pack"
              >
                <h3 className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-4">
                  Bulk Pack
                </h3>
                <p
                  className="font-mono text-[48px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                  style={{ fontFeatureSettings: '"tnum" 1' }}
                >
                  $99
                </p>
                <p className="text-[14px] text-[var(--text-tertiary)] mb-8">once</p>
                <ul className="flex-grow mb-8" role="list">
                  {[
                    '1,000 Death Certificate credits',
                    'Valid 2 years',
                    'Effective $0.099 per Cert',
                    '1.9× more credits than starter',
                  ].map((t) => (
                    <Feature key={t} text={t} />
                  ))}
                </ul>
                {/* TODO: replace href with Lemon Squeezy checkout URL */}
                <Link
                  href="#"
                  className="inline-flex items-center justify-center w-full px-6 py-[14px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
                >
                  Buy bulk
                </Link>
              </article>

            </div>

            {/* Refund note — TZ_03 §6.5 verbatim */}
            <p className="text-[14px] text-[var(--text-tertiary)] leading-[1.60]">
              Credits are non-refundable after 14 days. Within 14 days, unused credits can be refunded on request. Used credits are consumed value and cannot be refunded.
            </p>
          </div>
        </div>
      </section>


      {/* ── FOUNDER LIFETIME ────────────────────────────────────────────────
          TZ_03 §6.6 verbatim
          TZ_02 §6.2 section 6, §6.5: prominent single card, live counter
      ────────────────────────────────────────────────────────────────────── */}
      <section
        id="founder"
        aria-labelledby="founder-heading"
        className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
      >
        <div className="container">
          <article
            className="max-w-[680px] border border-[var(--border)] bg-[var(--paper)] p-10 md:p-12"
            aria-label="Founder Lifetime plan"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-5">
              Limited · 200 spots total
            </p>
            <h2
              id="founder-heading"
              className="font-serif font-bold text-[var(--text-primary)] leading-[1.10] tracking-[-0.02em] mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
              Founder Lifetime
            </h2>
            <p className="text-[18px] text-[var(--text-secondary)] leading-[1.60] mb-6">
              $99 once. Pro forever. Limited to 200 supporters.
            </p>

            {/*
            {/* Live Founder counter — TZ_02 §6.5, TZ_03 §6.6 */}
            {/* founderRemaining: null=RPC failed | 0=sold out | N=spots left */}
            <div className="inline-flex items-center gap-3 border border-[var(--border)] px-4 py-3 mb-8">
              <span
                className="w-[8px] h-[8px] rounded-full shrink-0"
                style={{ backgroundColor: founderRemaining === 0 ? 'var(--border-warm)' : 'var(--live)' }}
                aria-hidden="true"
              />
              <span className="font-mono text-[14px] text-[var(--text-primary)]">
                {founderRemaining === null ? (
                  <span className="text-[var(--text-tertiary)]">Limited to 200 spots</span>
                ) : founderRemaining === 0 ? (
                  <span style={{ color: 'var(--accent)' }} className="font-medium">Sold out</span>
                ) : (
                  <span style={{ color: 'var(--live)' }} className="font-medium">
                    {founderRemaining} of 200 remaining
                  </span>
                )}
              </span>
            </div>

            <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-8">
              Early-supporter access to all current and future Pro features. The cap is final. After 200 spots are filled, this tier closes permanently and will not relist.
            </p>

            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
              What is included
            </p>
            <ul className="mb-10" role="list">
              {[
                'Pro tier features for life of the project',
                'Founder badge on profile (optional public listing)',
                'Direct email line to Pavel for product feedback',
                'Priority access to upcoming features',
              ].map((t) => (
                <Feature key={t} text={t} />
              ))}
            </ul>

            {/* TODO: replace href with Lemon Squeezy checkout URL */}
            {founderRemaining === 0 ? (
              <div
                className="inline-flex items-center gap-2 px-8 py-[14px] text-[14px] font-medium border border-[var(--border)] text-[var(--text-tertiary)] cursor-not-allowed"
                aria-disabled="true"
              >
                Sold out
              </div>
            ) : (
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-8 py-[14px] text-[14px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
              >
                Become a Founder
                <span aria-hidden="true">→</span>
              </Link>
            )}

            {/* TZ_03 §6.6 verbatim */}
            <p className="text-[13px] text-[var(--text-tertiary)] leading-[1.60] mt-6">
              Refund window: 14 days. After 14 days, Lifetime is non-refundable. This is consistent with the limited cap structure.
            </p>
          </article>
        </div>
      </section>


      {/* ── RESEARCHER AND NONPROFIT ────────────────────────────────────────
          TZ_03 §6.7 verbatim
          TZ_02 §6.2 section 7, §6.3: 2 columns
          TZ_02 §6.7: Apply → email
      ────────────────────────────────────────────────────────────────────── */}
      <section
        id="researcher"
        aria-labelledby="researcher-section-heading"
        className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[800px]">

            <div>
              <h2
                id="researcher-section-heading"
                className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-3"
              >
                Researcher tier
              </h2>
              <p
                className="font-mono text-[40px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                $9
              </p>
              <p className="text-[14px] text-[var(--text-tertiary)] mb-6">
                per month. For independent and institutional researchers.
              </p>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65] mb-8">
                Access to Pro tier features at reduced price. Verification required: institutional .edu email auto-verified, or manual review for ORCID iD, ResearchGate profile, press credentials, or NGO research affiliation letter.
              </p>
              <a
                href="mailto:researcher@deadmeter.com?subject=Researcher%20tier%20application"
                className="inline-flex items-center gap-2 px-6 py-[13px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Apply for Researcher tier
              </a>
            </div>

            <div>
              <h2 className="font-serif text-[28px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-3">
                Nonprofit Pro
              </h2>
              <p
                className="font-mono text-[40px] font-medium text-[var(--text-primary)] leading-[1] tracking-[-0.03em] mb-1"
                style={{ fontFeatureSettings: '"tnum" 1' }}
              >
                Free
              </p>
              <p className="text-[14px] text-[var(--text-tertiary)] mb-6">
                for verified nonprofits.
              </p>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65] mb-8">
                Pro tier features at no cost for 501(c)(3) organizations and international equivalents. Manual review required.
              </p>
              <a
                href="mailto:nonprofit@deadmeter.com?subject=Nonprofit%20access%20application"
                className="inline-flex items-center gap-2 px-6 py-[13px] text-[14px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Apply for Nonprofit access
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ── FAQ ─────────────────────────────────────────────────────────────
          TZ_03 §6.8 verbatim
          TZ_02 §6.2 section 8, §6.3: single column 720px
          TZ_02 §6.7: cross-links /methodology, /faq, /privacy, /terms
      ────────────────────────────────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="py-[64px] md:py-[80px]">
        <div className="container">
          <div className="max-w-[720px]">
            <FAQBlock items={faqItems} includeSchema={false} />
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-[var(--border)]">
              <Link href="/methodology" className={lnk}>Methodology</Link>
              <Link href="/faq" className={lnk}>General FAQ</Link>
              <Link href="/privacy" className={lnk}>Privacy</Link>
              <Link href="/terms" className={lnk}>Terms</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}