import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description:
    'Frequently asked questions about Deadmeter methodology, tools, pricing, limitations, and the Sadasivan boundary on AI text detection.',
  path: '/faq',
  ogImage: '/og/faq.png',
});

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can AI-generated text be made to fool Cert?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. A 2023 result by Sadasivan and colleagues showed that no statistical detector can reliably distinguish AI-generated text from human-written text once the AI text has been sufficiently paraphrased or rewritten. Cert is robust to casual rewriting but degrades against deliberate paraphrasing tools or skilled human editing. We disclose this openly.' },
    },
    {
      '@type': 'Question',
      name: 'How accurate is Death Certificate?',
      acceptedAnswer: { '@type': 'Answer', text: 'Death Certificate provides calibrated confidence intervals rather than single accuracy numbers. Each Cert reports its own confidence interval. Wider intervals indicate more uncertainty for that specific document. Phase 0 empirical validation will produce specific in-domain and cross-domain accuracy numbers.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Deadmeter and AI detectors like GPTZero or Originality?',
      acceptedAnswer: { '@type': 'Answer', text: 'Commercial AI detectors classify individual documents as AI-generated or human-written with documented false positive rates of 5-20%. Deadmeter Pulse measures populations with calibrated confidence bounds. Deadmeter Cert applies to single documents but presents results as diagnostic signals with explicit confidence intervals and honest limitations.' },
    },
    {
      '@type': 'Question',
      name: 'Why is Twitter not in Pulse?',
      acceptedAnswer: { '@type': 'Answer', text: 'Twitter closed its public API to non-enterprise tiers in 2023. Available pricing exceeds our operating budget. Alternative paths do not meet our stability requirements for weekly publication.' },
    },
    {
      '@type': 'Question',
      name: 'How do I subscribe to Pulse?',
      acceptedAnswer: { '@type': 'Answer', text: 'Email signup on the homepage or on the /pulse page. We send the weekly Pulse and nothing else. No marketing. No tracking pixels. No promotional sequences. Unsubscribe with one click.' },
    },
    {
      '@type': 'Question',
      name: 'How is the methodology versioned?',
      acceptedAnswer: { '@type': 'Answer', text: 'Semantic versioning combined with SHA-256 hashes. Patch increments for bug fixes, minor increments for refinements under 2pp AUROC change, major increments for breaking changes. Every Cert and Pulse publication includes the active methodology version and hash.' },
    },
    {
      '@type': 'Question',
      name: 'Are tool results admissible as evidence?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. None of our tools produce evidence admissible in legal proceedings. Each tool disclaimer states this explicitly. Our tools provide diagnostic signals appropriate for investigative workflows, not legal verdicts.' },
    },
    {
      '@type': 'Question',
      name: 'What does the apolitical scope mean?',
      acceptedAnswer: { '@type': 'Answer', text: 'Deadmeter does not measure or report on political content: no elections, no government information operations, no active conflicts, no partisan advocacy, no identity politics. This is a permanent commitment.' },
    },
    {
      '@type': 'Question',
      name: 'Who funds Deadmeter?',
      acceptedAnswer: { '@type': 'Answer', text: 'Subscriptions and sponsorship. Not AI labs. Not government agencies. Not political organizations. Not venture capital. Sponsorship does not influence methodology, measurements, or coverage decisions.' },
    },
    {
      '@type': 'Question',
      name: 'How do I report an issue or request a correction?',
      acceptedAnswer: { '@type': 'Answer', text: 'Email feedback@deadmeter.com with the issue or correction request. Include URLs of affected pages, Cert hashes if applicable, and specific concern. Quarterly transparency reports document any corrections made.' },
    },
  ],
};

const lnk = 'text-[var(--text-primary)] underline decoration-solid decoration-[var(--accent)] decoration-[1.5px] underline-offset-[3px] [text-decoration-skip-ink:none] hover:decoration-[var(--text-primary)] transition-colors';

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Can AI-generated text be made to fool Cert?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">
          Yes. A 2023 result by Sadasivan and colleagues showed that no statistical detector can reliably distinguish AI-generated text from human-written text once the AI text has been sufficiently paraphrased or rewritten. This is a fundamental limit, not a flaw of any specific tool.
        </p>
        <p className="font-sans text-[15px] font-semibold text-[var(--text-primary)] mb-2">What this means in practice:</p>
        <ul className="space-y-1 mb-4 list-none p-0 m-0">
          {['Cert is robust to casual rewriting (typo fixes, light edits, tone adjustments, minor restructuring).', 'Cert degrades against deliberate paraphrasing tools, skilled human editing, or multi-pass rewrites by another LLM.', 'We disclose this openly. We do not claim to defeat motivated adversaries.'].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent)] flex-shrink-0 pt-[3px] text-[13px]">·</span>
              <span className="font-serif text-[16px] text-[var(--text-secondary)] leading-[1.6]">{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-sans text-[15px] font-semibold text-[var(--text-primary)] mb-2">Cert is most useful when:</p>
        <ul className="space-y-1 mb-4 list-none p-0 m-0">
          {['Measuring ecosystem-level trends (where adversaries are not uniformly motivated).', 'Comparing writing samples for stylometric similarity.', 'Investigating unmotivated or careless authorship attribution (homework AI use, content-mill spam, casual ghostwriting).'].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent)] flex-shrink-0 pt-[3px] text-[13px]">·</span>
              <span className="font-serif text-[16px] text-[var(--text-secondary)] leading-[1.6]">{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-sans text-[15px] font-semibold text-[var(--text-primary)] mb-2">Cert is least useful when:</p>
        <ul className="space-y-1 mb-4 list-none p-0 m-0">
          {['Confronting a sophisticated adversary actively trying to evade detection.', 'The text has been through multiple paraphrasing passes.', 'A single-source verdict is needed for a high-stakes decision (legal, employment, academic).'].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-[var(--accent)] flex-shrink-0 pt-[3px] text-[13px]">·</span>
              <span className="font-serif text-[16px] text-[var(--text-secondary)] leading-[1.6]">{item}</span>
            </li>
          ))}
        </ul>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">For investigative use against motivated adversaries, treat Cert as one signal among many. Not as definitive evidence.</p>
      </>
    ),
  },
  {
    q: 'How accurate is Death Certificate?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Death Certificate provides calibrated confidence intervals rather than single accuracy numbers. This is intentional. Single accuracy percentages obscure important per-domain and per-condition variation.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">In-domain performance refers to documents matching our calibration distribution: English prose, 2018-2024, mixed sources, no adversarial intent. Cross-domain covers underrepresented domains. Adversarial performance covers paraphrased and obfuscated text.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Each Cert reports its own confidence interval. Wider intervals indicate more uncertainty for that specific document. We prefer explicit per-document uncertainty over a global accuracy number that might mislead.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">Phase 0 empirical validation will produce specific accuracy numbers. These will be added to the <Link href="/methodology" className={lnk}>methodology page</Link> when validated.</p>
      </>
    ),
  },
  {
    q: 'What is the difference between Deadmeter and AI detectors like GPTZero or Originality?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Different tools for different questions.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Commercial AI detectors classify individual documents as AI-generated or human-written, often producing point estimates without confidence intervals. Documented false positive rates range 5-20% even for the best-performing systems. Applied to people (employment screening, academic discipline, content moderation), these rates produce significant harms.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Deadmeter&apos;s Pulse measures populations: aggregated estimates with calibrated confidence bounds. The question is &ldquo;what proportion of this stream shows AI patterns&rdquo; rather than &ldquo;is this specific text AI&rdquo;. Aggregation across many documents washes out individual classification noise.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Deadmeter&apos;s Cert applies to single documents but presents results as diagnostic signals with explicit confidence intervals and honest limitations disclosed upfront. Cert results are versioned and cryptographically signed for verification.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">Both kinds of tool have their place. They are not substitutes.</p>
      </>
    ),
  },
  {
    q: 'Why is Twitter not in Pulse?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Twitter (now X) closed its public API to non-enterprise tiers in 2023. Available pricing for compatible API access exceeds our operating budget. Alternative paths through scraping or third-party gateways do not meet our stability requirements for weekly publication.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">The <Link href="/methodology" className={lnk}>methodology page</Link> documents this exclusion. When public API access conditions change, or when an alternative data path matches our requirements, we will revisit.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">Bluesky inclusion is under evaluation for v1.1, conditional on 24+ months of post-launch baseline data, separate baseline methodology, and explicit experimental-stream marking.</p>
      </>
    ),
  },
  {
    q: 'How do I subscribe to Pulse?',
    a: (
      <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">
        Email signup on the <Link href="/" className={lnk}>homepage</Link> or on the <Link href="/pulse" className={lnk}>/pulse page</Link>. We send the weekly Pulse and nothing else. No marketing. No tracking pixels. No promotional sequences. Unsubscribe with one click in any email.
      </p>
    ),
  },
  {
    q: 'How is the methodology versioned?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Semantic versioning combined with SHA-256 hashes. Patch increments (v1.0.1) for bug fixes without AUROC change. Minor increments (v1.1) for refinements with under 2 percentage points AUROC change. Major increments (v2.0) for breaking changes that affect historical comparability.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Every Cert and every Pulse publication includes the active methodology version and hash. Historical methodology pages remain accessible at version-specific URLs.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">Quarterly transparency reports document any methodology changes.</p>
      </>
    ),
  },
  {
    q: 'Are tool results admissible as evidence?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">No. None of our tools produce evidence admissible in legal proceedings. Each tool&apos;s disclaimer states this explicitly.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">For legal proceedings, you need expert witness testimony based on multiple corroborating evidence types, chain-of-custody documentation, and methodology validated through peer review and court precedent. Our tools provide diagnostic signals appropriate for investigative workflows, not legal verdicts.</p>
      </>
    ),
  },
  {
    q: 'What does the apolitical scope mean?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Deadmeter does not measure or report on political content. No elections. No government information operations. No active conflicts. No partisan advocacy. No identity politics.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">This is implemented through stream selection (excluding political forums), NER-based filters in <Link href="/tools/bs-meter" className={lnk}>BS Meter</Link> and <Link href="/tools/dii" className={lnk}>Dead Internet Index</Link> (rejecting political-entity-dense inputs), sponsor category restrictions (auto-rejecting political organizations), and methodology disclosure.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">The scope deliberately privileges defensibility over breadth. This is a permanent commitment, not temporary positioning.</p>
      </>
    ),
  },
  {
    q: 'Who funds Deadmeter?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Subscriptions and sponsorship. Not AI labs. Not government agencies. Not political organizations. Not venture capital.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">The single-operator structure (Pavel Ishchin solo founder, Daniil testing, Evelina marketing) keeps overhead minimal. Founder Lifetime supporters provide bootstrap funding. Pro subscriptions provide recurring revenue.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">When sponsor relationships exist, they are disclosed in each Pulse publication with category and amount visibility. Sponsorship does not influence methodology, measurements, or coverage decisions.</p>
      </>
    ),
  },
  {
    q: 'How do I report an issue or request a correction?',
    a: (
      <>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65] mb-4">Email <a href="mailto:feedback@deadmeter.com" className={lnk}>feedback@deadmeter.com</a> with the issue or correction request. Include URLs of affected pages, Cert hashes if applicable, and specific concern.</p>
        <p className="font-serif text-[17px] text-[var(--text-secondary)] leading-[1.65]">Issues affecting methodology accuracy are addressed through the versioning process. Issues affecting tool behavior are addressed through bug fixes. Quarterly transparency reports document any corrections made.</p>
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />
      <div className="bg-[var(--bg)]">

        <div className="border-b border-[var(--border)]">
          <div className="container-reading pt-[20px] md:pt-[20px] pb-[28px] md:pb-[44px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-5">
              FAQ
            </p>
            <h1 className="font-serif text-[48px] font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em]">
              Frequently asked questions
            </h1>
          </div>
        </div>

        <div className="container-reading pt-[40px] pb-[80px] md:pb-[100px]">
  <dl>
    {faqs.map(({ q, a }, i) => (
      <div key={i} className="border-b border-[var(--border)] py-8">
                <dt className="mb-4">
                  <h2 className="font-sans text-[18px] font-semibold text-[var(--text-primary)] leading-[1.4]">
                    {q}
                  </h2>
                </dt>
                <dd className="m-0">{a}</dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </>
  );
}