/**
 * app/pulse/[slug]/page.tsx
 *
 * Individual Pulse issue page.
 *
 * TZ_02 §9.5 — page structure (10 sections)
 * TZ_05 Part 2 §1.1 — Article page template
 * TZ_05 Part 2 §1.1 — article body typography, container-reading 720px
 *
 * Content: markdown files in /content/pulse/[slug].md
 * Frontmatter parsed via gray-matter (TZ_04 §5.2, §19.1)
 * Rendered via remark → remark-html (TZ_04 §5.2)
 *
 * Required frontmatter fields:
 *   title: string
 *   date: string          — ISO 8601, e.g. "2026-06-03"
 *   issue: number         — e.g. 1
 *   deck: string          — subtitle / lead sentence
 *   ims_ecosystem: number — headline score 0–100
 *   ci_low: number        — 95% CI lower bound
 *   ci_high: number       — 95% CI upper bound
 *   methodology_version: string  — e.g. "v1.0"
 *   methodology_hash: string     — short SHA, e.g. "4F7A2C91"
 *   sponsor?: string      — optional sponsor name
 *   sponsor_category?: string
 *   sponsor_amount?: string
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPulseIssue, getAllPulseSlugs } from '@/lib/pulse';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { PulseSignupForm } from '@/components/shared/PulseSignupForm';

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllPulseSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getPulseIssue(slug);
  if (!issue) return {};

  const title = `${issue.title} · Pulse #${issue.issue} · Deadmeter`;
  const description = issue.deck;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: issue.date,
      url: `https://deadmeter.com/pulse/${slug}`,
    },
    alternates: {
      canonical: `https://deadmeter.com/pulse/${slug}`,
    },
  };
}

// ─── Schema ───────────────────────────────────────────────────────────────────

function buildSchema(issue: Awaited<ReturnType<typeof getPulseIssue>>) {
  if (!issue) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: issue.title,
    description: issue.deck,
    datePublished: issue.date,
    author: {
      '@type': 'Person',
      name: 'Pavel Ishchin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
    },
    url: `https://deadmeter.com/pulse/${issue.slug}`,
    isPartOf: {
      '@type': 'Blog',
      name: 'Pulse',
      url: 'https://deadmeter.com/pulse',
    },
  };
}

// ─── IMS score bar ────────────────────────────────────────────────────────────
// Inline component — no client state needed

function IMSHero({
  score,
  ciLow,
  ciHigh,
}: {
  score: number;
  ciLow: number;
  ciHigh: number;
}) {
  // Verbal label per TZ_03 §7.8
  const label =
    score <= 25 ? 'Live'
    : score <= 55 ? 'Hybrid'
    : score <= 80 ? 'Synthetic'
    : 'Dead';

  return (
    <div className="border border-[var(--border)] bg-[var(--paper)] p-8 md:p-10 my-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
        IMS_ecosystem · This issue
      </p>

      {/* Score */}
      <div className="flex items-baseline gap-4 mb-3">
        <span
          className="font-mono font-medium leading-[1] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(64px, 10vw, 96px)', fontFeatureSettings: '"tnum" 1' }}
        >
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-[20px] font-medium" style={{ color: 'var(--accent)' }}>
          {label}
        </span>
      </div>

      {/* CI */}
      <p className="font-mono text-[13px] text-[var(--text-tertiary)] mb-6">
        95% CI [{ciLow.toFixed(1)}, {ciHigh.toFixed(1)}]
      </p>

      {/* Bar track */}
      <div className="relative h-[6px] bg-[var(--border)] w-full">
        {/* CI range */}
        <div
          className="absolute h-full"
          style={{
            left: `${ciLow}%`,
            width: `${ciHigh - ciLow}%`,
            backgroundColor: 'var(--border-warm)',
          }}
          aria-hidden="true"
        />
        {/* Score tick */}
        <div
          className="absolute h-[14px] w-[3px] -top-[4px]"
          style={{
            left: `${score}%`,
            backgroundColor: 'var(--accent)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between mt-2 font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.06em]">
        <span>Live</span>
        <span>Hybrid</span>
        <span>Synthetic</span>
        <span>Dead</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PulseIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getPulseIssue(slug);

  if (!issue) notFound();

  // notFound() throws — TypeScript needs explicit assertion
  const safeIssue = issue as NonNullable<typeof issue>;
  const schema = buildSchema(safeIssue);

  // Format date for display: "June 3, 2026"
  const displayDate = new Date(safeIssue.date + 'T00:00:00Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  // Issue number padded: 001
  const issueNum = String(safeIssue.issue).padStart(3, '0');

  return (
    <>
      {schema && <SchemaMarkup schema={schema} />}

      <main id="main-content">

        {/* ── ARTICLE HEADER ────────────────────────────────────────────────
            TZ_05 Part 2 §1.1:
            - Issue eyebrow mono: "PULSE #001 · 2026-MM-DD"
            - H1 title (Source Serif Pro 48px desktop)
            - Deck / subtitle (22-26px, max-w 720px)
            - Byline mono 11px: "By Pavel Ishchin · Methodology v1.0 · [hash]"
            - Methodology metadata strip (border-top 1px)
        ──────────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="issue-heading"
          className="border-b border-[var(--border)]"
        >
          <div className="container pt-[80px] md:pt-[100px] pb-[48px] md:pb-[64px]">
            <div className="max-w-[720px]">

              {/* Eyebrow — TZ_05 Part 2 §1.1 */}
              <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-6">
                Pulse #{issueNum} · {safeIssue.date}
              </p>

              {/* H1 */}
              <h1
                id="issue-heading"
                className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.03em] mb-6"
                style={{ fontSize: 'clamp(36px, 5vw, 48px)' }}
              >
                {safeIssue.title}
              </h1>

              {/* Deck — TZ_05 Part 2 §1.1: 22-26px italic, max-w 720px */}
              <p
                className="font-serif italic text-[var(--text-secondary)] leading-[1.55] mb-8"
                style={{ fontSize: 'clamp(20px, 2.5vw, 24px)' }}
              >
                {safeIssue.deck}
              </p>

              {/* Byline — TZ_05 Part 2 §1.1 */}
              <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--text-tertiary)]">
                By Pavel Ishchin · Methodology {safeIssue.methodology_version} · {safeIssue.methodology_hash}
              </p>
            </div>
          </div>

          {/* Methodology metadata strip — TZ_05 Part 2 §1.1 */}
          <div className="border-t border-[var(--border)]">
            <div className="container py-4">
              <div className="flex flex-wrap gap-x-8 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                <span>Pulse · Weekly · Free forever</span>
                <span>{displayDate}</span>
                <span>n=750 documents</span>
                <span>Bootstrap CI 95%</span>
              </div>
            </div>
          </div>
        </section>


        {/* ── ARTICLE BODY ──────────────────────────────────────────────────
            TZ_02 §9.5 sections 3–8:
            3. Issue lead paragraph
            4. IMS_ecosystem hero
            5. Section 1: Headline finding
            6. Section 2: Per-stream breakdown
            7. Section 3: Notable patterns
            8. Section 4: Methodology note

            TZ_05 Part 2 §1.1:
            - container-reading 720px
            - font-serif 19px line-height 1.65
            - h2: 32px mt-14 mb-6
            - h3: 24px mt-10 mb-4
            - p: mb-6
            - a: accent underline
            - blockquote: border-left accent
        ──────────────────────────────────────────────────────────────────── */}
        <div className="container py-[64px] md:py-[80px]">
          <div className="max-w-[720px] mx-auto">

            {/* IMS hero — TZ_02 §9.5 section 4 */}
            <IMSHero
              score={safeIssue.ims_ecosystem}
              ciLow={safeIssue.ci_low}
              ciHigh={safeIssue.ci_high}
            />

            {/* Article body from markdown — TZ_05 Part 2 §1.1 */}
            <div
              className={[
                // Typography — TZ_05 Part 2 §1.1 article body spec
                'font-serif text-[19px] leading-[1.65] text-[var(--text-primary)]',
                // p
                '[&>p]:mb-6',
                // h2
                '[&>h2]:font-serif [&>h2]:text-[32px] [&>h2]:font-bold [&>h2]:tracking-[-0.02em]',
                '[&>h2]:leading-[1.15] [&>h2]:mt-14 [&>h2]:mb-6',
                // h3
                '[&>h3]:font-serif [&>h3]:text-[24px] [&>h3]:font-bold [&>h3]:tracking-[-0.015em]',
                '[&>h3]:leading-[1.20] [&>h3]:mt-10 [&>h3]:mb-4',
                // strong / em
                '[&_strong]:font-bold',
                '[&_em]:italic',
                // links — TZ_05 Part 2 §1.1
                '[&_a]:text-[var(--text-primary)] [&_a]:underline [&_a]:[text-decoration-thickness:1.5px]',
                '[&_a]:[text-underline-offset:3px] [&_a]:[text-decoration-color:var(--accent)]',
                '[&_a:hover]:[text-decoration-color:var(--text-primary)]',
                // ul / ol
                '[&>ul]:mb-6 [&>ul]:pl-7 [&>ol]:mb-6 [&>ol]:pl-7',
                '[&_li]:mb-3',
                // blockquote — TZ_05 Part 2 §1.1
                '[&>blockquote]:border-l-4 [&>blockquote]:[border-left-color:var(--accent)]',
                '[&>blockquote]:pl-6 [&>blockquote]:my-8 [&>blockquote]:italic',
                '[&>blockquote]:text-[var(--text-secondary)]',
                // hr
                '[&>hr]:border-[var(--border)] [&>hr]:my-10',
              ].join(' ')}
              dangerouslySetInnerHTML={{ __html: safeIssue.contentHtml }}
            />

          </div>
        </div>


        {/* ── METHODOLOGY FOOTER BLOCK ──────────────────────────────────────
            TZ_02 §9.5 section 8 (Methodology note)
            TZ_05 Part 2 §1.1: border-top 1px, mono 12px, hash + corpus + signature
        ──────────────────────────────────────────────────────────────────── */}
        <section
          aria-label="Methodology disclosure"
          className="border-t border-b border-[var(--border)] py-6"
        >
          <div className="container">
            <div className="max-w-[720px] mx-auto">
              <div className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-[12px] tracking-[0.06em] text-[var(--text-tertiary)] mb-3">
                <span>Methodology {safeIssue.methodology_version}</span>
                <span>Hash {safeIssue.methodology_hash}</span>
                <span>n=750 · Bootstrap 1000 iterations</span>
              </div>
              <Link
                href="/methodology"
                className="font-mono text-[12px] tracking-[0.06em] underline [text-decoration-thickness:1.5px] [text-underline-offset:3px] [text-decoration-color:var(--accent)] hover:[text-decoration-color:var(--text-primary)] transition-colors"
              >
                Full methodology →
              </Link>
            </div>
          </div>
        </section>


        {/* ── SPONSOR DISCLOSURE ────────────────────────────────────────────
            TZ_02 §9.5 section 9: only rendered if issue has a sponsor
            TZ_03 §12.5: "Sponsorship confirmation · Pulse #[N]"
        ──────────────────────────────────────────────────────────────────── */}
        {safeIssue.sponsor && (
          <section
            aria-label="Sponsor disclosure"
            className="border-b border-[var(--border)] py-6"
          >
            <div className="container">
              <div className="max-w-[720px] mx-auto">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">
                  Sponsor disclosure
                </p>
                <p className="text-[15px] text-[var(--text-secondary)] leading-[1.55]">
                  This issue is sponsored by{' '}
                  <span className="text-[var(--text-primary)] font-medium">{safeIssue.sponsor}</span>
                  {safeIssue.sponsor_category && ` (${safeIssue.sponsor_category})`}
                  {safeIssue.sponsor_amount && ` · ${safeIssue.sponsor_amount}`}
                  . Sponsorship does not influence methodology, measurements, or coverage decisions.
                </p>
              </div>
            </div>
          </section>
        )}


        {/* ── SUBSCRIBE CTA ─────────────────────────────────────────────────
            TZ_02 §9.5 section 10: subscribe for new visitors via shared link
            TZ_05 Part 2 §1.1: "Subscribe CTA (full-width, accent bg)" —
            uses PulseSignupForm with source="pulse-page"
        ──────────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="subscribe-heading"
          className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <div className="container">
            <div className="max-w-[560px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.10em] mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Publication · Weekly · Free forever
              </p>
              <h2
                id="subscribe-heading"
                className="font-serif text-[32px] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-4"
              >
                Subscribe to Pulse
              </h2>
              {/* TZ_03 §9.4 verbatim */}
              <p className="text-[17px] leading-[1.70] mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Pulse arrives weekly. A short, sober summary of the week&apos;s measurements across our three monitored streams. Tuesday mornings.
              </p>
              <PulseSignupForm />
              {/* TZ_03 §9.4 verbatim */}
              <p className="text-[13px] leading-[1.60] mt-5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                We send Pulse and nothing else. No marketing. No tracking pixels. No promotional sequences. One click to unsubscribe.
              </p>
            </div>
          </div>
        </section>


        {/* ── NAVIGATION ────────────────────────────────────────────────────
            TZ_02 §9.6 cross-links from individual issue:
            - /methodology
            - /tools/dii (related tool)
            Back to Pulse archive
        ──────────────────────────────────────────────────────────────────── */}
        <section className="py-8">
          <div className="container">
            <div className="max-w-[720px] mx-auto flex flex-wrap gap-6">
              <Link
                href="/pulse"
                className="font-mono text-[12px] uppercase tracking-[0.08em] underline [text-decoration-thickness:1.5px] [text-underline-offset:3px] [text-decoration-color:var(--accent)] hover:[text-decoration-color:var(--text-primary)] transition-colors"
              >
                ← All issues
              </Link>
              <Link
                href="/methodology"
                className="font-mono text-[12px] uppercase tracking-[0.08em] underline [text-decoration-thickness:1.5px] [text-underline-offset:3px] [text-decoration-color:var(--accent)] hover:[text-decoration-color:var(--text-primary)] transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/tools/dii"
                className="font-mono text-[12px] uppercase tracking-[0.08em] underline [text-decoration-thickness:1.5px] [text-underline-offset:3px] [text-decoration-color:var(--accent)] hover:[text-decoration-color:var(--text-primary)] transition-colors"
              >
                Dead Internet Index
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}