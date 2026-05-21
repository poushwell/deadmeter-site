import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { FAQBlock } from '@/components/shared/FAQBlock';
import { NotifyForm } from './NotifyForm';

// ─── Meta (TZ_03 §5.1 — verbatim) ────────────────────────────────────────────

export const metadata: Metadata = buildMetadata({
  title: 'Tools',
  description:
    'Eight tools for measuring AI content signatures, authorship patterns, code stylometry, structural prose patterns, and ecosystem-level synthetic content prevalence.',
  path: '/tools',
});

// ─── Schema (TZ_03 §5.2 + FAQPage + Organization per TZ_05 §9) ───────────────

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://deadmeter.com/tools',
      name: 'Deadmeter Tools',
      description: 'Eight tools for content analysis and AI detection diagnostics.',
      url: 'https://deadmeter.com/tools',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@type': 'SoftwareApplication', name: 'Death Certificate',    url: 'https://deadmeter.com/cert',                        applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 2, item: { '@type': 'SoftwareApplication', name: 'Writing DNA',          url: 'https://deadmeter.com/tools/writing-dna',            applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 3, item: { '@type': 'SoftwareApplication', name: 'AI Text Checker',      url: 'https://deadmeter.com/tools/ai-text-checker',        applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 4, item: { '@type': 'SoftwareApplication', name: 'Code DNA',             url: 'https://deadmeter.com/tools/code-dna',               applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 5, item: { '@type': 'SoftwareApplication', name: 'BS Meter',             url: 'https://deadmeter.com/tools/bs-meter',               applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 6, item: { '@type': 'SoftwareApplication', name: 'Dead Internet Index',  url: 'https://deadmeter.com/tools/dead-internet-index',    applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 7, item: { '@type': 'SoftwareApplication', name: 'AI Flattener',         url: 'https://deadmeter.com/tools/ai-flattener',           applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 8, item: { '@type': 'SoftwareApplication', name: 'AEO Checker',          url: 'https://deadmeter.com/tools/aeo-checker',            applicationCategory: 'AnalyticsApplication' } },
          { '@type': 'ListItem', position: 9, item: { '@type': 'SoftwareApplication', name: 'Phylogeny',            url: 'https://deadmeter.com/tools/phylogeny',              applicationCategory: 'AnalyticsApplication' } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Are these tools real-time?',                            acceptedAnswer: { '@type': 'Answer', text: 'Yes. Each tool provides immediate results. Death Certificate processing takes 30-60 seconds due to comprehensive analysis. Other tools return results in under 5 seconds.' } },
        { '@type': 'Question', name: 'What languages do tools support?',                      acceptedAnswer: { '@type': 'Answer', text: 'English only at v1.0. Tools reject non-English input with suggested alternatives. Multilingual support is on the Year 1 roadmap conditional on Phase 0 validation success.' } },
        { '@type': 'Question', name: 'Can I use tools through an API?',                       acceptedAnswer: { '@type': 'Answer', text: 'Yes, with a Pro subscription or Scale tier. Free tier is web-only. API documentation appears on /docs after Pro signup.' } },
        { '@type': 'Question', name: 'Are tool results shareable?',                           acceptedAnswer: { '@type': 'Answer', text: 'Yes. Each result has a permanent URL with reproducibility hash. Death Certificate results are cryptographically signed via Ed25519.' } },
        { '@type': 'Question', name: 'What is the difference between Cert and AI Text Checker?', acceptedAnswer: { '@type': 'Answer', text: 'Cert is the comprehensive analysis: four-feature pipeline, bootstrap confidence intervals, methodology disclosure, cryptographic signature. Latency 30-60 seconds. Diagnostic quality. AI Text Checker is the lightweight first-pass: four-feature composite without LLM inference, no confidence intervals, no signature. Latency under 2 seconds. Quick utility. Different use cases. Both share the same underlying methodology direction.' } },
      ],
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

// ─── Types ────────────────────────────────────────────────────────────────────

type ToolStatus = 'available' | 'coming-soon';

interface Tool {
  id: string;
  name: string;
  status: ToolStatus;
  advanced?: boolean;
  wide?: boolean;        // Phylogeny spans full grid width
  href?: string;         // only for available tools
  ctaLabel?: string;
  description: string;
  bestFor: string[];
  notFor: string[];
}

// ─── Tool data (TZ_03 §5.4 — verbatim) ───────────────────────────────────────

const tools: Tool[] = [
  {
    id: 'death-certificate',
    name: 'Death Certificate',
    status: 'available',
    href: '/cert',
    ctaLabel: 'Run Death Certificate',
    description:
      'Statistical signature analysis for a single document. Returns a calibrated IMS_text score with 95% confidence interval and one of four verbal labels. Each Certificate is cryptographically signed and reproducible from the published text.',
    bestFor: [
      'investigative document review',
      'ghostwriter detection signals',
      'educational diagnostic',
    ],
    notFor: [
      'legal evidence',
      'employment decisions',
      'academic discipline without corroborating evidence',
    ],
  },
  {
    id: 'writing-dna',
    name: 'Writing DNA',
    status: 'coming-soon',
    description:
      'Stylometric similarity comparison between two writing samples. Returns a similarity score from 0 to 100 with breakdown across stylometric axes including sentence rhythm, function word usage, and lexical diversity patterns.',
    bestFor: [
      'comparing two articles for shared authorship signals',
      'detecting writer changes within a body of work',
    ],
    notFor: [
      'legal proof of authorship',
      'definitive identification',
    ],
  },
  {
    id: 'ai-text-checker',
    name: 'AI Text Checker',
    status: 'coming-soon',
    description:
      'Quick structural check for AI-generated patterns in a single text. Composite of four lightweight features. Returns AI-likelihood as percentage with verbal label.',
    bestFor: [
      'fast first-pass diagnostic',
      'content workflow integration',
    ],
    notFor: [
      'definitive verdicts. For deeper analysis use Death Certificate',
    ],
  },
  {
    id: 'code-dna',
    name: 'Code DNA',
    status: 'coming-soon',
    description:
      'Stylometric similarity for code samples. Compares two code snippets across naming conventions, indentation patterns, comment density, function structure, and language idiom usage. Supports Python, JavaScript, and TypeScript at launch.',
    bestFor: [
      'code authorship inference',
      'plagiarism review',
    ],
    notFor: [
      'code quality assessment',
      'security audit',
      'code review substitute',
    ],
  },
  {
    id: 'bs-meter',
    name: 'BS Meter',
    status: 'coming-soon',
    description:
      'Detects structural patterns associated with low-content prose: hedging stacks, vague quantifiers, evasive language, buzzword density, AI-shaped phrase patterns. Marks text with category breakdown.',
    bestFor: [
      'detecting filler in marketing copy',
      'corporate communications review',
    ],
    notFor: [
      'fact-checking. BS Meter says nothing about whether claims are true or false',
    ],
  },
  {
    id: 'dead-internet-index',
    name: 'Dead Internet Index',
    status: 'coming-soon',
    description:
      'Stream-level analysis of synthetic content prevalence. Submit a Reddit thread, YouTube comments section, or Hacker News thread URL. Returns ecosystem-level score with sample-based confidence.',
    bestFor: [
      "snapshot of a single conversation's authenticity",
      'journalist verification of public discourse',
    ],
    notFor: [
      'individual user verdict',
      'account-level decisions',
    ],
  },
  {
    id: 'ai-flattener',
    name: 'AI Flattener',
    status: 'coming-soon',
    description:
      'A demonstration tool. Submit a text. The tool runs three different LLM rewriting prompts and shows the IMS_text score for original versus rewritten variants. Visualizes the typical pattern: AI processing tends to push texts toward higher Synthetic scores.',
    bestFor: [
      'educational demonstration',
      'research illustration',
    ],
    notFor: [
      'productivity tool',
      'content improvement service',
    ],
  },
  {
    id: 'aeo-checker',
    name: 'AEO Checker',
    status: 'coming-soon',
    description:
      'Answer Engine Optimization assessment. Free tier analyzes page structure (Schema.org markup, heading hierarchy, FAQ patterns, citation density). Paid tier additionally queries ChatGPT, Claude, and Perplexity to measure actual citation patterns for the page.',
    bestFor: [
      'content optimization for LLM-driven discovery',
    ],
    notFor: [
      'definitive ranking prediction. Engines change continuously',
    ],
  },
  {
    id: 'phylogeny',
    name: 'Phylogeny',
    status: 'coming-soon',
    advanced: true,
    wide: true,
    description:
      'Builds a structural similarity tree across a stream of content. Uses NCD compression distance and neighbor-joining algorithm to visualize authorship clustering patterns. Reticulation index detects recombinant structure.',
    bestFor: [
      'deep stream analysis',
      'coordinated network investigation',
    ],
    notFor: [
      'claims about real-world relationships between accounts or people. The tool measures structural patterns only',
    ],
  },
];

// ─── Inline link style ────────────────────────────────────────────────────────

const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] ' +
  '[text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] ' +
  'hover:decoration-[var(--text-primary)] transition-colors';

// ─── FAQ data (TZ_03 §5.6 — verbatim) ────────────────────────────────────────

const faqItems = [
  {
    question: 'Are these tools real-time?',
    answer: (
      <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
        Yes. Each tool provides immediate results. Death Certificate processing takes 30-60
        seconds due to comprehensive analysis. Other tools return results in under 5 seconds.
      </p>
    ),
  },
  {
    question: 'What languages do tools support?',
    answer: (
      <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
        English only at v1.0. Tools reject non-English input with suggested alternatives.
        Multilingual support is on the Year 1 roadmap conditional on Phase 0 validation success.
      </p>
    ),
  },
  {
    question: 'Can I use tools through an API?',
    answer: (
      <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
        Yes, with a{' '}
        <Link href="/pricing" className={lnk}>
          Pro subscription
        </Link>{' '}
        or Scale tier. Free tier is web-only. API documentation appears on /docs after Pro signup.
      </p>
    ),
  },
  {
    question: 'Are tool results shareable?',
    answer: (
      <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
        Yes. Each result has a permanent URL with reproducibility hash. Death Certificate results
        are cryptographically signed via Ed25519.
      </p>
    ),
  },
  {
    question: 'What is the difference between Cert and AI Text Checker?',
    answer: (
      <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
        Cert is the comprehensive analysis: four-feature pipeline, bootstrap confidence intervals,
        methodology disclosure, cryptographic signature. Latency 30-60 seconds. Diagnostic
        quality. AI Text Checker is the lightweight first-pass: four-feature composite without LLM
        inference, no confidence intervals, no signature. Latency under 2 seconds. Quick utility.
        Different use cases. Both share the same underlying methodology direction.
      </p>
    ),
  },
];

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, advanced }: { status: ToolStatus; advanced?: boolean }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {status === 'available' ? (
        <span
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.10em] font-medium"
          style={{ color: 'var(--live)' }}
          aria-label="Status: Available"
        >
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0"
            style={{ backgroundColor: 'var(--live)' }}
            aria-hidden="true"
          />
          Available
        </span>
      ) : (
        <span
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] font-medium"
          aria-label="Status: Coming soon"
        >
          <span
            className="w-[6px] h-[6px] rounded-full shrink-0 border border-[var(--border-warm)]"
            aria-hidden="true"
          />
          Coming soon
        </span>
      )}
      {advanced && (
        <span className="font-mono text-[10px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] border border-[var(--border)] px-2 py-1">
          Advanced
        </span>
      )}
    </div>
  );
}

// ─── ToolCard ─────────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: Tool }) {
  const isAvailable = tool.status === 'available';

  return (
    <article
      className="flex flex-col h-full border border-[var(--border)] bg-[var(--paper)] p-7 md:p-8 transition-colors hover:border-[var(--text-primary)]"
      aria-label={tool.name}
    >
      {/* Header: name + status badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em]">
          {tool.name}
        </h2>
        <StatusBadge status={tool.status} advanced={tool.advanced} />
      </div>

      {/* Description — TZ_05 Body M 16px */}
      <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65] mb-6">
        {tool.description}
      </p>

      {/* Best for / Not for */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-2">
            Best for
          </p>
          <ul className="space-y-1.5">
            {tool.bestFor.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.50]"
              >
                <span
                  className="shrink-0 text-[10px] mt-1"
                  style={{ color: 'var(--live)' }}
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-2">
            Not for
          </p>
          <ul className="space-y-1.5">
            {tool.notFor.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-2 text-[13px] text-[var(--text-secondary)] leading-[1.50]"
              >
                <span
                  className="shrink-0 text-[var(--text-tertiary)] text-[10px] mt-1"
                  aria-hidden="true"
                >
                  ✕
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA pushed to bottom — TZ_05 §6 Button: 14px/28px */}
      <div className="mt-auto pt-5 border-t border-[var(--border)]">
        {isAvailable && tool.href ? (
          <Link
            href={tool.href}
            className="inline-flex items-center gap-2 px-7 py-[14px] text-[14px] font-medium bg-[var(--accent)]  text-white  hover:bg-[var(--accent-hover)] transition-colors"
            aria-label={tool.ctaLabel}
          >
            {tool.ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <NotifyForm toolName={tool.name} />
        )}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />

      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────────────────────
            TZ_03 §5.3 verbatim
            TZ_02 §5.3: "Hero centered, narrow column (max 800px)"
            TZ_05 §4: Hero padding 100-120px desktop / 60-80px mobile
        ──────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="tools-heading"
          className="border-b border-[var(--border)]"
        >
          <div className="container pt-[80px] md:pt-[100px] pb-[56px] md:pb-[64px]">
            <div className="max-w-[800px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-6">
                Diagnostic instruments
              </p>
              <h1
                id="tools-heading"
                className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-6"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                Tools
              </h1>
              <p className="text-[19px] text-[var(--text-secondary)] leading-[1.55] max-w-[600px]">
                Eight tools for specific questions about content authenticity, authorship, and
                ecosystem health. Each ships with explicit limitations and per-tool disclosure.
              </p>
            </div>
          </div>
        </section>


        {/* ── TOOL GRID ────────────────────────────────────────────────────
            TZ_02 §5.3: 2-3 column desktop, 2 columns tablet, 1 column mobile
            TZ_02 §5.4: [name][status][description][best for][not for][CTA]
            TZ_02 §5.7: no "Featured", no comparison table, no "Recommended"
            Phylogeny (tool.wide) spans both columns per advanced status
        ──────────────────────────────────────────────────────────────── */}
        <section
          aria-label="All tools"
          className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
        >
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={tool.wide ? 'md:col-span-2' : ''}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── HOW TOOLS RELATE ─────────────────────────────────────────────
            TZ_03 §5.5 verbatim
            TZ_02 §5.3: single column, comfortable reading width (720px)
            Cross-links: /pulse, /methodology per TZ_02 §5.6
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="how-tools-relate"
          aria-labelledby="relate-heading"
          className="border-b border-[var(--border)] py-[64px] md:py-[80px]"
        >
          <div className="container">
            <div className="max-w-[720px]">
              <h2
                id="relate-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-10"
              >
                How tools relate
              </h2>

              <div className="space-y-8 mb-10">
                {[
                  {
                    label: 'Single-document',
                    value: 'Writing DNA, AI Text Checker, Code DNA, BS Meter, AI Flattener, Death Certificate.',
                  },
                  {
                    label: 'Single-page',
                    value: 'AEO Checker.',
                  },
                  {
                    label: 'Stream-level',
                    value: 'Dead Internet Index, Phylogeny.',
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 sm:gap-8 items-baseline border-t border-[var(--border)] pt-6"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] font-medium">
                      {row.label}
                    </p>
                    <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65]">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-5">
                The Death Certificate is the flagship per-document tool with full methodology depth
                and 95% confidence intervals. The seven mini-tools provide quicker, focused
                diagnostic signals. Phylogeny provides advanced structural analysis for streams.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-8">
                For deepest analysis: Death Certificate. For specific questions: matching
                mini-tool. For ecosystem health: Dead Internet Index plus weekly{' '}
                <Link href="/pulse" className={lnk}>
                  Pulse
                </Link>
                .
              </p>

              <div className="flex flex-wrap gap-6">
                <Link href="/methodology" className={lnk}>
                  Methodology
                </Link>
                <Link href="/pulse" className={lnk}>
                  Pulse
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ── FAQ ──────────────────────────────────────────────────────────
            TZ_03 §5.6 verbatim
            TZ_02 §5.3: single column
            FAQBlock includeSchema=false — FAQPage already in @graph above
            Cross-links: /pricing per TZ_02 §5.6 (inside FAQ answer)
        ──────────────────────────────────────────────────────────────── */}
        <section
          id="faq"
          className="py-[64px] md:py-[80px]"
        >
          <div className="container">
            <div className="max-w-[720px]">
              <FAQBlock
  items={faqItems}
  includeSchema={false}
/>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}