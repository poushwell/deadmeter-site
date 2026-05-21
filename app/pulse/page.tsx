import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { PulseSignupForm } from '@/components/shared/PulseSignupForm';

// ─── Meta (TZ_03 §9.1 — дословно) ───────────────────────────────────────────

export const metadata: Metadata = buildMetadata({
  title: 'Pulse · Weekly internet content tracking',
  description:
    'Weekly snapshot of AI saturation across three streams of technical discourse: Hacker News, Reddit, and tech blogs. Tuesdays at 10am UTC. Free forever.',
  path: '/pulse',
});

// ─── Schema (TZ_03 §9.2 + Organization per TZ_05 §9) ─────────────────────────

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      '@id': 'https://deadmeter.com/pulse',
      name: 'Pulse',
      description: 'Weekly internet content tracking from Deadmeter.',
      url: 'https://deadmeter.com/pulse',
      publisher: {
        '@type': 'Person',
        name: 'Pavel Ishchin',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://deadmeter.com/pulse#webpage',
      url: 'https://deadmeter.com/pulse',
      name: 'Pulse · Weekly internet content tracking · Deadmeter',
      description:
        'Weekly snapshot of AI saturation across three streams of technical discourse: Hacker News, Reddit, and tech blogs. Tuesdays at 10am UTC. Free forever.',
      isPartOf: { '@id': 'https://deadmeter.com' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://deadmeter.com/#organization',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
      logo: 'https://deadmeter.com/logo.png',
      founder: { '@type': 'Person', name: 'Pavel Ishchin' },
      description: 'Internet content tracking with calibrated confidence intervals.',
    },
  ],
};

// ─── Inline link style (consistent with other pages) ─────────────────────────

const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] ' +
  '[text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] ' +
  'hover:decoration-[var(--text-primary)] transition-colors';

// ─── Streams data (TZ_03 §9.5) ───────────────────────────────────────────────

const streams = [
  { name: 'Hacker News', scope: 'Comments', n: '250' },
  { name: 'Reddit', scope: 'Seven curated subreddits', n: '250' },
  { name: 'Tech blogs', scope: 'Fifty curated sources', n: '250' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export default function PulsePage() {
  return (
    <>
      <SchemaMarkup schema={schema} />

      <main id="main-content">

        {/* ── §1 HERO ────────────────────────────────────────────────────
            TZ_03 §9.3: H1, subtitle, placeholder card, intro copy
            TZ_05 §5: Hero padding 100-120px desktop / 60-80px mobile
            TZ_05 §3: H1 Display → clamp 48-80px, Source Serif Pro, -0.025em
        ──────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="pulse-heading"
          className="border-b border-[var(--border)]"
        >
          <div className="container pt-[80px] md:pt-[100px] pb-[64px] md:pb-[80px]">

            {/* Eyebrow strip — mono uppercase, TZ_05 §3 Meta S 11px */}
            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-8"
              aria-hidden="true"
            >
              {['Publication', 'Weekly', 'Free forever'].map((label, i) => (
                <span key={label} className="flex items-center gap-4">
                  {i > 0 && (
                    <span className="text-[var(--border-warm)] select-none">·</span>
                  )}
                  <span className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)]">
                    {label}
                  </span>
                </span>
              ))}
            </div>

            {/* Two-column grid: headline / placeholder card
                Колонки: 1fr 320px на lg, stacked на mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">

              {/* Left column */}
              <div>
                <h1
                  id="pulse-heading"
                  className="font-serif font-bold text-[var(--text-primary)] leading-[1.0] tracking-[-0.025em] mb-6"
                  style={{ fontSize: 'clamp(48px, 7vw, 80px)' }}
                >
                  Pulse
                </h1>

                {/* TZ_03 §9.3 subtitle — Body XL 19px */}
                <p className="text-[19px] text-[var(--text-secondary)] leading-[1.55] mb-6 max-w-[480px]">
                  Weekly internet content tracking. Tuesdays at 10am UTC. Free forever.
                </p>

                {/* TZ_03 §9.3 intro paragraph */}
                <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65] max-w-[480px]">
                  The first Pulse arrives soon. Subscribe below to receive it directly when it
                  publishes.
                </p>
              </div>

              {/* Right column — latest issue placeholder card
                  TZ_02 §9.4: "Hero showcases latest issue" (on launch — placeholder)
                  TZ_03 §9.3: "Launching MM-DD-2026" */}
              <div
                className="border border-[var(--border)] bg-[var(--surface-warm)]"
                role="region"
                aria-label="Latest issue"
              >
                <div className="px-6 pt-6 pb-5 border-b border-[var(--border)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    Latest issue
                  </p>
                </div>
                <div className="px-6 py-6">
                  <p
                    className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-3"
                  >
                    Launching 2026
                  </p>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-[1.60] mb-6">
                    The first weekly snapshot of AI saturation across three monitored streams of
                    technical discourse.
                  </p>
                  <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                      Tuesdays · 10:00 UTC
                    </p>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] border border-[var(--border)] px-2 py-1"
                      aria-label="Status: upcoming"
                    >
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ── §2 SUBSCRIBE ───────────────────────────────────────────────
            TZ_03 §9.4 — дословно
            TZ_05 §4: Standard section 80-100px padding
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="subscribe"
          aria-labelledby="subscribe-heading"
          className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
        >
          <div className="container">
            {/* TZ_02 §9.4: "Subscribe section centered" */}
            <div className="max-w-[600px] mx-auto">

              {/* H2 — TZ_05 §3: 32px / 1.15 / -0.020em / 700 / Source Serif Pro */}
              <h2
                id="subscribe-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-5"
              >
                Subscribe
              </h2>

              {/* TZ_03 §9.4 body paragraph */}
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-8">
                Pulse arrives weekly. A short, sober summary of the week&apos;s measurements
                across our three monitored streams. Tuesday mornings.
              </p>

              {/* Form — max-w 480px per TZ_02 §9 */}
              <div className="max-w-[480px]">
                <PulseSignupForm />
              </div>

              {/* TZ_03 §9.4 privacy note — Body S 14px */}
              <p className="text-[14px] text-[var(--text-tertiary)] leading-[1.55] mt-5 max-w-[480px]">
                We send Pulse and nothing else. No marketing. No tracking pixels. No promotional
                sequences. One click to unsubscribe.
              </p>

            </div>
          </div>
        </section>


        {/* ── §3 WHAT PULSE MEASURES ─────────────────────────────────────
            TZ_03 §9.5 — дословно
            Layout: описание слева, data table справа на lg
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="what-pulse-measures"
          aria-labelledby="measures-heading"
          className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
        >
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-20 items-start max-w-[1040px]">

              {/* Left: text */}
              <div>
                <h2
                  id="measures-heading"
                  className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-6"
                >
                  What Pulse measures
                </h2>

                {/* TZ_03 §9.5 — три потока */}
                <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-5">
                  Three streams of technical discourse:
                </p>

                {/* TZ_03 §9.5 — IMS_ecosystem description */}
                <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-5">
                  The headline number is IMS_ecosystem, a calibrated estimate of the proportion of
                  synthetic content across all three streams combined. Reported with 95%
                  confidence intervals from bootstrap resampling.
                </p>

                {/* TZ_03 §9.5 — exclusions note */}
                <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-8">
                  Streams are deliberately scoped to apolitical technical discussion. Twitter,
                  Threads, and Bluesky are not included in v1.0. The methodology page documents
                  these exclusions.
                </p>

                {/* TZ_03 §9.5 — cross-link */}
                <Link href="/methodology" className={lnk}>
                  Read the methodology
                </Link>
              </div>

              {/* Right: structured data table — n=250 per stream
                  TZ_05 §2.3: real <table> element, tabular figures */}
              <table
                className="w-full border border-[var(--border)] border-collapse"
                aria-label="Monitored streams"
              >
                <thead>
                  <tr className="bg-[var(--surface-warm)] border-b border-[var(--border)]">
                    <th
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] text-left px-5 py-3 font-medium"
                      scope="col"
                    >
                      Stream
                    </th>
                    <th
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] text-right px-5 py-3 font-medium"
                      scope="col"
                    >
                      Sample
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {streams.map((row) => (
                    <tr key={row.name} className="border-b border-[var(--border)]">
                      <td className="px-5 py-5 align-top">
                        <p className="text-[15px] font-medium text-[var(--text-primary)] leading-[1.35] mb-1">
                          {row.name}
                        </p>
                        <p className="text-[13px] text-[var(--text-tertiary)] leading-[1.45]">
                          {row.scope}
                        </p>
                      </td>
                      <td
                        className="font-mono text-[14px] font-medium text-[var(--text-secondary)] tracking-[0.04em] tabular-nums text-right px-5 py-5 align-top"
                        aria-label={'Sample size: ' + row.n}
                      >
                        n={row.n}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Total — tfoot, border-t-2 для visual weight */}
                <tfoot>
                  <tr className="border-t-2 border-[var(--text-primary)] bg-[var(--surface-warm)]">
                    <td className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-secondary)] font-medium px-5 py-4">
                      Weekly total
                    </td>
                    <td
                      className="font-mono text-[16px] font-medium text-[var(--text-primary)] tracking-[-0.01em] tabular-nums text-right px-5 py-4"
                      aria-label="Weekly total: 750 documents"
                    >
                      750
                    </td>
                  </tr>
                </tfoot>
              </table>

            </div>
          </div>
        </section>


        {/* ── §4 ARCHIVE ─────────────────────────────────────────────────
            TZ_03 §9.6 — на launch: empty placeholder
            TZ_02 §9.7: no pagination, no search when < 20 issues
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="archive"
          aria-labelledby="archive-heading"
          className="py-[64px] md:py-[80px]"
        >
          <div className="container">
            <div className="max-w-[720px]">

              <h2
                id="archive-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8"
              >
                Archive
              </h2>

              {/* Empty state with ghost of future entry — TZ_03 §9.6 */}
              <div
                className="border border-dashed border-[var(--border)] px-8 py-10 md:py-12"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
                  No issues yet
                </p>
                {/* TZ_03 §9.6 dословно */}
                <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-8">
                  Past issues will appear here as they publish.
                </p>

                {/* Пример будущей записи — помогает понять формат, opacity 35% */}
                <div
                  className="border-t border-[var(--border)] pt-6 opacity-35 select-none"
                  aria-hidden="true"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">
                    Pulse #001 · 2026-MM-DD
                  </p>
                  <p className="text-[16px] font-medium text-[var(--text-primary)] leading-[1.45] mb-2">
                    Issue title
                  </p>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] mb-3">
                    Brief excerpt from the issue will appear here.
                  </p>
                  <p className="font-mono text-[12px] text-[var(--text-tertiary)] tracking-[0.04em]">
                    IMS_ecosystem ·· ± ··
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}