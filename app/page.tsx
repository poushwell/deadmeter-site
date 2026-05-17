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
        'Internet content tracking with calibrated confidence intervals. Weekly measurements of AI saturation, bot activity, and information manipulation across major platforms.',
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
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="font-serif font-bold text-lg text-[var(--text-primary)] no-underline">
            Deadmeter
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main navigation">
            <Link href="/methodology" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Methodology</Link>
            <Link href="/tools" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Tools</Link>
            <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Pricing</Link>
            <Link href="/faq" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">FAQ</Link>
            <Link href="/cert" className="ml-2 px-3.5 py-1.5 border border-[var(--border-warm)] rounded text-sm text-[var(--text-primary)] no-underline hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
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
        <section aria-labelledby="hero-heading" className="py-24 md:py-36 bg-[var(--bg)]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 id="hero-heading" className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[var(--text-primary)] leading-tight mb-6">
                Internet content tracking, with confidence intervals.
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed mb-10 max-w-2xl mx-auto">
                Weekly measurements of AI saturation, bot activity, and information manipulation
                across major platforms. Open methodology. Apolitical scope. No proof, no verdicts,
                no certainty theatre.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/pulse" className="px-6 py-3 bg-[var(--accent)] text-white font-medium text-sm rounded no-underline hover:bg-[var(--accent-hover)] transition-colors">
                  See latest Pulse
                </Link>
                <Link href="/cert" className="px-6 py-3 border border-[var(--border-warm)] text-[var(--text-primary)] font-medium text-sm rounded no-underline hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                  Run Death Certificate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE MEASURE */}
        <section aria-labelledby="measure-heading" className="py-20 md:py-28 bg-[var(--surface-warm)] border-y border-[var(--border)]">
          <div className="container">
            <div className="mb-10">
              <h2 id="measure-heading" className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                What we measure
              </h2>
              <p className="text-[var(--text-secondary)]">Three layers of measurement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <article className="flex flex-col">
                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-3">
                  Pulse
                  <span className="ml-2 text-xs font-sans font-normal text-[var(--text-tertiary)] align-middle">weekly publication</span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  A weekly snapshot of three streams of technical discourse: Hacker News comments,
                  Reddit aggregate across seven curated subreddits, and tech blog comments across
                  fifty curated sources. Published every Tuesday at 10am UTC. Free forever.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  The headline number is IMS_ecosystem, a calibrated estimate of the proportion of
                  synthetic content across the monitored streams. Reported with 95% confidence
                  intervals derived from bootstrap resampling.
                </p>
                <Link href="/pulse" className="text-sm text-[var(--accent)] font-medium no-underline hover:underline mt-auto">
                  Read the latest Pulse &rarr;
                </Link>
              </article>

              <article className="flex flex-col">
                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-3">
                  Death Certificate
                  <span className="ml-2 text-xs font-sans font-normal text-[var(--text-tertiary)] align-middle">per-document</span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  Submit a single document. Get back a calibrated IMS_text score from 0 to 100
                  with explicit confidence interval and one of four verbal labels: Live, Hybrid,
                  Synthetic, Dead. Each Certificate is cryptographically signed and reproducible
                  from the published text.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  The tool reflects statistical signature, not authorship proof. Robust to casual
                  rewriting. Not robust to deliberate paraphrasing or skilled human editing.
                </p>
                <Link href="/cert" className="text-sm text-[var(--accent)] font-medium no-underline hover:underline mt-auto">
                  Run Death Certificate &rarr;
                </Link>
              </article>

              <article className="flex flex-col">
                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-3">
                  Tools
                  <span className="ml-2 text-xs font-sans font-normal text-[var(--text-tertiary)] align-middle">utility layer</span>
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  Eight tools for specific questions: Writing DNA for stylometric comparison, AI
                  Text Checker for quick diagnostics, Code DNA for code authorship signals, BS Meter
                  for structural patterns of low-content prose, Dead Internet Index for stream-level
                  analysis, AI Flattener as a demonstration tool, AEO Checker for answer-engine
                  optimization, and Phylogeny for structural similarity trees across content streams.
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  Each tool ships with explicit limitations and per-tool disclosure.
                </p>
                <Link href="/tools" className="text-sm text-[var(--accent)] font-medium no-underline hover:underline mt-auto">
                  See all tools &rarr;
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section aria-labelledby="how-heading" className="py-20 md:py-28 bg-[var(--bg)]">
          <div className="container">
            <div className="max-w-2xl">
              <h2 id="how-heading" className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
                How it works
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Architecture A combines four orthogonal signals: a stylometric vector, a perplexity
                distribution, character-level entropy patterns, and discourse-level cohesion. The
                combination is calibrated against a multi-corpus baseline drawn from 2018-2021
                sources, with disclosed contamination estimates of 1-5%.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The methodology is versioned with semantic versioning and cryptographic hashes.
                Every measurement reports both sampling uncertainty (from bootstrap resampling) and
                calibration uncertainty (from baseline contamination estimates) as separate components.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                The full methodology is published openly. Calibration corpora rotate quarterly.
                Adversarial benchmarks are public.
              </p>
              <Link href="/methodology" className="text-sm text-[var(--accent)] font-medium no-underline hover:underline">
                Read the methodology &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* WHO USES DEADMETER */}
        <section aria-labelledby="who-heading" className="py-20 md:py-28 bg-[var(--surface-dark)]">
          <div className="container">
            <h2 id="who-heading" className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-on-dark)] mb-12">
              Who uses Deadmeter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-on-dark)] mb-3">Investigative journalists</h3>
                <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed">
                  Tracking AI saturation in news ecosystems. Verifying source authenticity.
                  Cross-referencing claims about content authorship. The methodology page provides
                  citable references and the Pulse archive offers historical trend data.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-on-dark)] mb-3">Researchers</h3>
                <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed">
                  Studying information manipulation, AI detection methodology, and adversarial
                  robustness. Published methodology with versioned hashes supports reproducible
                  research. Restricted academic access to extended benchmark sets available via
                  application.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-on-dark)] mb-3">Individuals analyzing specific documents</h3>
                <p className="text-sm text-[var(--text-on-dark-secondary)] leading-relaxed mb-3">
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
          </div>
        </section>

        {/* ABOUT THIS PROJECT */}
        <section aria-labelledby="about-heading" className="py-20 md:py-28 bg-[var(--bg)]">
          <div className="container">
            <div className="max-w-2xl">
              <h2 id="about-heading" className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
                About this project
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Deadmeter is a single-operator project. Methodology development, infrastructure,
                and weekly Pulse production are handled by one person with one tester. There is no
                institutional review, no redundant validation, no independent replication baked
                into the workflow.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                The work is funded by subscriptions and sponsorship. Not backed by AI labs,
                government agencies, political organizations, or venture capital. Treat findings
                accordingly and weigh corroborating evidence highly.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                When measurement methodology changes, version increments are documented publicly.
                When limitations are discovered, they are added to the limitations list openly.
                Quarterly transparency reports detail any material changes.
              </p>
            </div>
          </div>
        </section>

        {/* SUBSCRIBE TO PULSE */}
        <section aria-labelledby="subscribe-heading" className="py-20 md:py-28 bg-[var(--surface-warm)] border-t border-[var(--border)]">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <h2 id="subscribe-heading" className="font-serif text-3xl font-bold text-[var(--text-primary)] mb-3">
                Pulse arrives weekly
              </h2>
              <p className="text-[var(--text-secondary)] mb-8">
                A short, sober summary of the week&apos;s measurements. Tuesday mornings. Free forever.
              </p>
              <form action="/api/subscribe" method="POST" className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="subscribe-email" className="sr-only">Email address</label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button type="submit" className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded hover:bg-[var(--accent-hover)] transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-[var(--text-tertiary)] mt-4">
                We send the weekly Pulse and nothing else. No marketing. No tracking pixels. Unsubscribe with one click.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg)] py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <Link href="/" className="font-serif font-bold text-[var(--text-primary)] no-underline">Deadmeter</Link>
            </div>
            <nav aria-label="Product links">
              <ul className="flex flex-col gap-2 text-sm list-none p-0 m-0">
                <li><Link href="/methodology" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Methodology</Link></li>
                <li><Link href="/tools" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Tools</Link></li>
                <li><Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Pricing</Link></li>
                <li><Link href="/faq" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">FAQ</Link></li>
              </ul>
            </nav>
            <nav aria-label="Content links">
              <ul className="flex flex-col gap-2 text-sm list-none p-0 m-0">
                <li><Link href="/pulse" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Pulse</Link></li>
                <li><Link href="/cert" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Death Certificate</Link></li>
              </ul>
            </nav>
            <nav aria-label="Legal links">
              <ul className="flex flex-col gap-2 text-sm list-none p-0 m-0">
                <li><Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">Cookies</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-[var(--border)] pt-6">
            <p className="text-xs text-[var(--text-tertiary)] font-mono">
              Methodology v1.0 &middot; 2026 Pavel Ishchin
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}