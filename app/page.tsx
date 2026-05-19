import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Deadmeter · Internet content tracking with confidence intervals',
  description:
    'Weekly measurements of AI saturation, bot activity, and information manipulation across major platforms. Open methodology. Apolitical scope. No proof, no verdicts, no certainty theatre.',
  openGraph: {
    title: 'Deadmeter · Internet content tracking with confidence intervals',
    description:
      'Weekly measurements of AI saturation, bot activity, and information manipulation across major platforms. Open methodology. Apolitical scope.',
    url: 'https://deadmeter.com',
    type: 'website',
    images: [{ url: 'https://deadmeter.com/og/home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deadmeter · Internet content tracking with confidence intervals',
    description:
      'Weekly measurements of AI saturation, bot activity, and information manipulation across major platforms. Open methodology. Apolitical scope.',
    images: ['https://deadmeter.com/og/home.png'],
  },
};

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
      description:
        'Internet content tracking with calibrated confidence intervals.',
      publisher: { '@type': 'Person', name: 'Pavel Ishchin' },
    },
    {
      '@type': 'WebPage',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
      description: 'Internet content tracking with calibrated confidence intervals.',
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does Deadmeter measure?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Deadmeter measures the proportion of AI-generated content, coordinated activity, and information manipulation across monitored streams of public discourse, publishing weekly reports with calibrated 95% confidence intervals.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who uses Deadmeter?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Investigative journalists tracking AI saturation in news ecosystems, researchers studying information manipulation, and individuals analyzing specific documents through the Death Certificate tool.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Deadmeter an AI detector?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. AI detectors classify individual documents, with known false positive rates of 5-20% even at best. Deadmeter measures populations: aggregated estimates with calibrated confidence bounds. Different question, different tool.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is the methodology validated?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Through a public adversarial benchmark suite covering 9 attack types across 4 stream sizes and 4 content domains. Results published quarterly. Methodology versioned with cryptographic hashes for reproducibility.',
            },
          },
        ],
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="container flex items-center justify-between py-6">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]"
          >
            Deadmeter
          </Link>
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link href="/methodology" className="text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              Methodology
            </Link>
            <Link href="/tools" className="text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              Tools
            </Link>
            <Link href="/pricing" className="text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="text-[15px] font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
              FAQ
            </Link>
            <Link
              href="/cert"
              className="ml-2 px-4 py-2 border border-[var(--text-primary)] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg)] transition-colors"
            >
              Sign in
            </Link>
          </nav>
          <button className="md:hidden p-1 text-[var(--text-secondary)]" aria-label="Open navigation menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <rect y="3" width="20" height="1.5" rx="0.75" />
              <rect y="9" width="20" height="1.5" rx="0.75" />
              <rect y="15" width="20" height="1.5" rx="0.75" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section aria-labelledby="hero-heading" className="py-[100px] md:py-[120px] bg-[var(--bg)]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                id="hero-heading"
                className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-8"
                style={{ fontSize: 'clamp(48px, 7vw, 80px)' }}
              >
                Internet content tracking, with confidence intervals.
              </h1>
              <p className="text-[19px] text-[var(--text-secondary)] leading-[1.55] mb-12 max-w-2xl mx-auto">
                Weekly measurements of AI saturation, bot activity, and information manipulation
                across major platforms. Open methodology. Apolitical scope. No proof, no verdicts,
                no certainty theatre.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pulse"
                  className="inline-flex items-center justify-center px-7 py-[14px] bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
                >
                  See latest Pulse
                </Link>
                <Link
                  href="/cert"
                  className="inline-flex items-center justify-center px-[27px] py-[13px] border border-[var(--text-primary)] text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--text-primary)] hover:text-[var(--bg)] transition-colors"
                >
                  Run Death Certificate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE MEASURE */}
        <section aria-labelledby="measure-heading" className="py-[80px] md:py-[100px] bg-[var(--surface-warm)] border-y border-[var(--border)]">
          <div className="container">
            <div className="mb-14">
              <h2
                id="measure-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-2"
              >
                What we measure
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)]">Three layers of measurement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="flex flex-col">
                <h3 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-1">
                  Pulse
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-5">
                  Weekly publication
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  A weekly snapshot of three streams of technical discourse: Hacker News comments,
                  Reddit aggregate across seven curated subreddits, and tech blog comments across
                  fifty curated sources. Published every Tuesday at 10am UTC. Free forever.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  The headline number is IMS_ecosystem, a calibrated estimate of the proportion of
                  synthetic content across the monitored streams. Reported with 95% confidence
                  intervals derived from bootstrap resampling.
                </p>
                <Link href="/pulse" className="text-sm text-[var(--accent)] font-medium mt-auto">
                  Read the latest Pulse &rarr;
                </Link>
              </article>

              <article className="flex flex-col">
                <h3 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-1">
                  Death Certificate
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-5">
                  Per-document
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  Submit a single document. Get back a calibrated IMS_text score from 0 to 100
                  with explicit confidence interval and one of four verbal labels: Live, Hybrid,
                  Synthetic, Dead. Each Certificate is cryptographically signed and reproducible
                  from the published text.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  The tool reflects statistical signature, not authorship proof. Robust to casual
                  rewriting. Not robust to deliberate paraphrasing or skilled human editing.
                </p>
                <Link href="/cert" className="text-sm text-[var(--accent)] font-medium mt-auto">
                  Run Death Certificate &rarr;
                </Link>
              </article>

              <article className="flex flex-col">
                <h3 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-1">
                  Tools
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-5">
                  Utility layer
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  Eight tools for specific questions: Writing DNA for stylometric comparison, AI
                  Text Checker for quick diagnostics, Code DNA for code authorship signals, BS Meter
                  for structural patterns of low-content prose, Dead Internet Index for stream-level
                  analysis, AI Flattener as a demonstration tool, AEO Checker for answer-engine
                  optimization, and Phylogeny for structural similarity trees across content streams.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  Each tool ships with explicit limitations and per-tool disclosure.
                </p>
                <Link href="/tools" className="text-sm text-[var(--accent)] font-medium mt-auto">
                  See all tools &rarr;
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section aria-labelledby="how-heading" className="py-[80px] md:py-[100px] bg-[var(--bg)]">
          <div className="container">
            <div className="max-w-2xl">
              <h2
                id="how-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8"
              >
                How it works
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.60] mb-5">
                Architecture A combines four orthogonal signals: a stylometric vector, a perplexity
                distribution, character-level entropy patterns, and discourse-level cohesion. The
                combination is calibrated against a multi-corpus baseline drawn from 2018-2021
                sources, with disclosed contamination estimates of 1-5%.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.60] mb-5">
                The methodology is versioned with semantic versioning and cryptographic hashes.
                Every measurement reports both sampling uncertainty (from bootstrap resampling) and
                calibration uncertainty (from baseline contamination estimates) as separate components.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.60] mb-10">
                The full methodology is published openly. Calibration corpora rotate quarterly.
                Adversarial benchmarks are public.
              </p>
              <Link href="/methodology" className="text-sm text-[var(--accent)] font-medium">
                Read the methodology &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* WHO USES DEADMETER — dark inversion card */}
        <section
          aria-labelledby="who-heading"
          className="mx-4 md:mx-8 rounded-[16px] md:rounded-[24px] py-[60px] px-7 md:py-[100px] md:px-16 bg-[var(--surface-dark)] overflow-hidden"
        >
          <h2
            id="who-heading"
            className="font-serif font-bold text-[var(--text-on-dark)] leading-[1.05] tracking-[-0.02em] mb-16"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Who uses Deadmeter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14">
            <div>
              <div className="border-t border-white/15 mb-7" />
              <h3 className="font-serif text-[20px] font-bold text-[var(--text-on-dark)] mb-4">
                Investigative journalists
              </h3>
              <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed">
                Tracking AI saturation in news ecosystems. Verifying source authenticity.
                Cross-referencing claims about content authorship. The methodology page provides
                citable references and the Pulse archive offers historical trend data.
              </p>
            </div>
            <div>
              <div className="border-t border-white/15 mb-7" />
              <h3 className="font-serif text-[20px] font-bold text-[var(--text-on-dark)] mb-4">
                Researchers
              </h3>
              <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed">
                Studying information manipulation, AI detection methodology, and adversarial
                robustness. Published methodology with versioned hashes supports reproducible
                research. Restricted academic access to extended benchmark sets available via
                application.
              </p>
            </div>
            <div>
              <div className="border-t border-white/15 mb-7" />
              <h3 className="font-serif text-[20px] font-bold text-[var(--text-on-dark)] mb-4">
                Individuals analyzing specific documents
              </h3>
              <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed mb-4">
                Writers verifying their own content has not been mistakenly flagged. Editors
                checking ghostwriter authorship signals. Educators reviewing submissions with
                appropriate honest disclosure to students about tool limitations.
              </p>
              <p className="text-sm text-[var(--text-on-dark-tertiary)] leading-relaxed">
                The tools provide diagnostic signals. Not legal evidence. Not academic discipline
                grounds. Not employment decision criteria.
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT THIS PROJECT */}
        <section aria-labelledby="about-label" className="py-[80px] md:py-[100px] bg-[var(--bg)]">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-20 items-start">
              <div className="pt-1">
                <p
                  id="about-label"
                  className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]"
                >
                  About this project
                </p>
              </div>
              <div>
                <p
                  className="font-serif text-[var(--text-secondary)] leading-[1.45] mb-5"
                  style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
                >
                  Deadmeter is a{' '}
                  <span className="text-[var(--accent-bordeaux)]">single-operator project</span>.
                  Methodology development, infrastructure, and weekly Pulse production are handled
                  by one person with one tester. There is no institutional review, no redundant
                  validation, no independent replication baked into the workflow.
                </p>
                <p
                  className="font-serif text-[var(--text-secondary)] leading-[1.45] mb-5"
                  style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
                >
                  The work is funded by subscriptions and sponsorship. Not backed by AI labs,
                  government agencies, political organizations, or venture capital. Treat findings
                  accordingly and weigh corroborating evidence highly.
                </p>
                <p
                  className="font-serif text-[var(--text-secondary)] leading-[1.45]"
                  style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
                >
                  When measurement methodology changes, version increments are documented publicly.
                  When limitations are discovered, they are added to the limitations list openly.
                  Quarterly transparency reports detail any material changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUBSCRIBE TO PULSE */}
        <section aria-labelledby="subscribe-heading" className="py-[80px] md:py-[100px] bg-[var(--surface-warm)] border-t border-[var(--border)]">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <h2
                id="subscribe-heading"
                className="font-serif text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-3"
              >
                Pulse arrives weekly
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] mb-10">
                A short, sober summary of the week&apos;s measurements. Tuesday mornings. Free forever.
              </p>
              <form action="/api/subscribe" method="POST" className="flex flex-col sm:flex-row">
                <label htmlFor="subscribe-email" className="sr-only">Email address</label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="flex-1 px-4 py-3 border border-[var(--border)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[16px] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  style={{ borderRadius: 0 }}
                />
                <button
                  type="submit"
                  className="px-7 py-3 bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap"
                  style={{ borderRadius: 0 }}
                >
                  Subscribe
                </button>
              </form>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-5">
                We send the weekly Pulse and nothing else. No marketing. No tracking pixels.
                Unsubscribe with one click.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--bg)] pt-16 pb-10">
        <div className="container">
          <div className="footer-grid grid grid-cols-2 gap-8 mb-14">
            <div className="footer-brand col-span-2 md:col-span-1">
              <Link
                href="/"
                className="font-serif text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] block mb-3"
              >
                Deadmeter
              </Link>
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] max-w-[280px]">
                Internet content tracking with calibrated confidence intervals.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-4">
                Product
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="/methodology" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Methodology</Link></li>
                <li><Link href="/pricing" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-4">
                Tools
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="/tools" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">All tools</Link></li>
                <li><Link href="/cert" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Death Certificate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-4">
                Pulse
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="/pulse" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Latest issue</Link></li>
                <li><Link href="/pulse" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Archive</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-4">
                Legal
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                <li><Link href="/privacy" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
              METHODOLOGY V1.0 · 2026 PAVEL ISHCHIN
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}