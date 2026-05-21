'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

const sections = [
  { id: 'section-1',  num: '§1',  title: 'What we measure'              },
  { id: 'section-2',  num: '§2',  title: 'How we calibrate'             },
  { id: 'section-3',  num: '§3',  title: 'Confidence intervals'         },
  { id: 'section-4',  num: '§4',  title: 'Adversarial testing'          },
  { id: 'section-5',  num: '§5',  title: 'Versioning'                   },
  { id: 'section-6',  num: '§6',  title: 'Single-operator transparency' },
  { id: 'section-7',  num: '§7',  title: 'Apolitical scope'             },
  { id: 'section-8',  num: '§8',  title: 'Limitations'                  },
  { id: 'section-9',  num: '§9',  title: 'Multi-source closure'         },
  { id: 'section-10', num: '§10', title: 'Sadasivan boundary'           },
];

function SectionHeading({ num, children }: { num: string; children: ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-4 font-serif text-[28px] md:text-[32px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.02em] mb-8">
      <span className="font-mono text-[18px] font-medium text-[var(--accent)] flex-shrink-0 leading-none">{num}</span>
      {children}
    </h2>
  );
}

function P({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={'text-[17px] text-[var(--text-secondary)] leading-[1.7]' + (className ? ' ' + className : '')}>
      {children}
    </p>
  );
}

function InlineLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  const cls = 'text-[var(--text-primary)] underline decoration-[var(--accent)] decoration-[1.5px] underline-offset-[3px] [text-decoration-skip-ink:none] hover:decoration-[var(--text-primary)] transition-colors';
  if (external) {
    return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <Link href={href} className={cls}>{children}</Link>;
}

function Bullet({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3 list-none p-0 m-0">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="font-mono text-[var(--accent)] flex-shrink-0 pt-[4px] text-[14px] leading-none">·</span>
          <span className="text-[17px] text-[var(--text-secondary)] leading-[1.7]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto mb-8">
      <div className="border border-[var(--border)] overflow-hidden min-w-[480px]">
        {children}
      </div>
    </div>
  );
}

function ColLabel({ label }: { label: string }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-secondary)] mb-3">
      {label}
    </p>
  );
}

export default function MethodologyContent() {
  const [activeSection, setActiveSection] = useState('section-1');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[var(--bg)]">

      <div className="border-b border-[var(--border)]">
        <div className="container py-[80px] md:py-[100px]">
          <div className="max-w-[720px]">
            <h1
              className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-8"
              style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
            >
              Methodology
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[var(--border)]">
              {([
                ['Version',                  'v1.0'           ],
                ['Last updated',             '2026-MM-DD'     ],
                ['Hash',                     '········'       ],
                ['Reference implementation', 'deadmeter:v1.0' ],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-1">{label}</p>
                  <p className="font-mono text-[13px] text-[var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden border-b border-[var(--border)] bg-[var(--surface-warm)]">
        <div className="container py-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Jump to section
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className={'transition-transform duration-150 ' + (mobileOpen ? 'rotate-180' : '')}>
              <path d="M5 7L0.5 2.5h9L5 7z" />
            </svg>
          </button>
          {mobileOpen && (
            <ul className="mt-3 pb-1 list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {sections.map(({ id, num, title }) => (
                <li key={id}>
                  <a
                    href={'#' + id}
                    onClick={() => setMobileOpen(false)}
                    className={'flex items-center gap-3 py-2 text-[13px] border-b border-[var(--border)] transition-colors ' + (activeSection === id ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')}
                  >
                    <span className="font-mono text-[11px] text-[var(--accent)] flex-shrink-0 w-7">{num}</span>
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container py-[80px] md:py-[100px]">
        <div className="lg:flex lg:gap-[80px] lg:items-start">

          <aside className="hidden lg:block flex-shrink-0 sticky top-[108px] self-start" style={{ width: 250 }}>
            <nav aria-label="Table of contents">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-5 pt-10">Contents</p>
              <ul className="space-y-0.5 list-none p-0 m-0">
                {sections.map(({ id, num, title }) => (
                  <li key={id}>
                    <a
                      href={'#' + id}
                      className={'group flex items-start gap-3 py-2 pl-3 text-[13px] leading-[1.45] transition-colors border-l-2 ' + (activeSection === id ? 'text-[var(--text-primary)] border-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent')}
                    >
                      <span className={'font-mono text-[11px] flex-shrink-0 mt-[3px] w-7 transition-colors ' + (activeSection === id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--accent)]')}>
                        {num}
                      </span>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="flex-1 min-w-0 max-w-[720px]">

            <section id="section-1" className="pt-10 mb-[80px]">
              <SectionHeading num="§1">What we measure</SectionHeading>
              <P className="mb-6">Deadmeter operates two related measurements at different scales.</P>
              <P className="mb-6">
                <code>IMS_ecosystem</code> is a population-level estimate of synthetic content proportion within a monitored stream of documents. The estimate incorporates four signals: a stylometric vector, perplexity distribution, character-level entropy patterns, and discourse-level cohesion. These are combined through a calibrated generalized linear model with isotonic regression for probability calibration.
              </P>
              <P className="mb-6">
                <code>IMS_text</code> applies the same underlying signals to a single document. The output is a calibrated score from 0 to 100 with one of four verbal labels: Live, Hybrid, Synthetic, Dead. Confidence intervals are derived from bootstrap resampling over text fragments.
              </P>
              <P>
                The two measurements differ in important ways. <code>IMS_ecosystem</code> aggregates over many documents, averaging out individual document noise. <code>IMS_text</code> is a per-document score subject to the Sadasivan boundary (§10), which states that no statistical detector can reliably distinguish AI-generated text from human-written text under sufficient adversarial paraphrasing.
              </P>
            </section>

            <section id="section-2" className="mb-[80px]">
              <SectionHeading num="§2">How we calibrate</SectionHeading>
              <P className="mb-6">The calibration baseline is constructed from six pre-2022 sources with weighted contributions:</P>
              <TableWrap>
                <div className="grid grid-cols-[1fr_72px] border-b border-[var(--border)] bg-[var(--surface-warm)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] px-5 py-3">Source</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] px-5 py-3 text-right">Weight</p>
                </div>
                {([
                  ['Common Crawl 2018-2020',              '25%'],
                  ['Reddit Pushshift archives 2017-2021', '25%'],
                  ['Wikipedia 2020 dump',                 '20%'],
                  ['Hacker News archive 2018-2021',       '15%'],
                  ['Project Gutenberg',                   '10%'],
                  ['arXiv abstracts 2018-2021',            '5%'],
                ] as [string, string][]).map(([source, weight], i, arr) => (
                  <div key={source} className={'grid grid-cols-[1fr_72px] items-center' + (i < arr.length - 1 ? ' border-b border-[var(--border)]' : '')}>
                    <span className="text-[15px] text-[var(--text-secondary)] px-5 py-3">{source}</span>
                    <span className="font-mono text-[14px] font-medium text-[var(--text-primary)] px-5 py-3 text-right font-feature-tnum">{weight}</span>
                  </div>
                ))}
              </TableWrap>
              <P className="mb-6">Each source has an estimated baseline contamination rate documented in the methodology archive. Aggregate weighted contamination is approximately 3.4%, with a range of 2.0-5.3% accounting for per-source uncertainty.</P>
              <P className="mb-6">Four parallel calibration corpora are maintained. Rotation occurs quarterly through a deterministic seeded permutation. The active corpus identifier is disclosed in every Pulse publication footer and in the API response for every Cert.</P>
              <P>
                Calibration baseline data is available for independent audit at{' '}
                <InlineLink href="https://deadmeter.com/transparency/datasets/calibration-baseline-v1" external>deadmeter.com/transparency/datasets/calibration-baseline-v1</InlineLink>.
              </P>
            </section>

            <section id="section-3" className="mb-[80px]">
              <SectionHeading num="§3">Confidence intervals</SectionHeading>
              <P className="mb-6">Reported confidence intervals have two components.</P>
              <P className="mb-6">Sampling uncertainty derives from bootstrap resampling at 10,000 iterations. This reflects variability when resampling input documents within the stream or text fragments within a single document.</P>
              <P className="mb-6">Calibration baseline uncertainty derives from per-source contamination estimates documented in §2. This component is propagated through corpus weighting and GLM coefficients to produce a wider total interval.</P>
              <P className="mb-6">The reported interval combines both components conservatively. Actual measurement uncertainty likely sits closer to the sampling-only interval, but we report the wider interval as honest disclosure of model assumptions.</P>
              <P className="mb-6">Two-interval display is available. The narrow sampling-only interval appears prominently. The wider total interval is accessible via a &lsquo;show calibration uncertainty&rsquo; control.</P>
              <P>Confidence intervals do not bound error against motivated adversaries. This is documented in §4 and §10.</P>
            </section>

            <section id="section-4" className="mb-[80px]">
              <SectionHeading num="§4">Adversarial testing</SectionHeading>
              <P className="mb-6">The methodology is validated against a public adversarial benchmark suite. Nine attacks across four stream sizes and four content domains produce 144 evaluation cells.</P>
              <ColLabel label="Attacks" />
              <TableWrap>
                {([
                  ['A1', 'Naive paraphrase',     'single-pass LLM rewriting'                        ],
                  ['A2', 'Aggressive paraphrase', 'multi-pass through diverse humanizers'            ],
                  ['A3', 'Style mimicking',       'few-shot prompting to match human author profiles'],
                  ['A4', 'RL-class evasion',      'DIPPER aggressive proxy for closed StealthRL'    ],
                  ['A5', 'Word substitution',     'synonym replacement via embedding distances'      ],
                  ['A6', 'Homoglyph substitution','defended via NFKC normalization'                  ],
                  ['A7', 'Prompt injection',      'LLM rewriting with anti-detection prompting'      ],
                  ['A8', 'Hybrid',                'simulated human-edited AI content'                ],
                  ['A9', 'Format perturbation',   'defended via preprocessing normalization'         ],
                ] as [string, string, string][]).map(([code, name, desc], i, arr) => (
                  <div key={code} className={'grid grid-cols-[48px_160px_1fr] items-start gap-3 px-5 py-3' + (i < arr.length - 1 ? ' border-b border-[var(--border)]' : '')}>
                    <code className="text-[12px] font-medium text-[var(--accent)] pt-[3px]">{code}</code>
                    <span className="text-[14px] font-medium text-[var(--text-primary)] leading-[1.5]">{name}</span>
                    <span className="text-[14px] text-[var(--text-secondary)] leading-[1.5]">{desc}</span>
                  </div>
                ))}
              </TableWrap>
              <P className="mb-6">Stream sizes: <code>n=50</code>, <code>n=200</code>, <code>n=500</code>, <code>n=2000</code>. Content domains: technical, casual, academic, creative. All apolitical.</P>
              <ColLabel label="Three-ring disclosure architecture" />
              <TableWrap>
                {([
                  ['Public ring',     '180 streams',  'CC BY 4.0, openly downloadable'         ],
                  ['Academic ring',   '720 streams',  'NDA, available to verified researchers' ],
                  ['Private holdout', '1800 streams', 'production calibration'                 ],
                ] as [string, string, string][]).map(([ring, count, desc], i, arr) => (
                  <div key={ring} className={'grid grid-cols-[130px_100px_1fr] items-center gap-4 px-5 py-3' + (i < arr.length - 1 ? ' border-b border-[var(--border)]' : '')}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-[var(--text-tertiary)]">{ring}</span>
                    <span className="font-mono text-[14px] font-feature-tnum text-[var(--text-primary)]">{count}</span>
                    <span className="text-[14px] text-[var(--text-secondary)]">{desc}</span>
                  </div>
                ))}
              </TableWrap>
              <P className="mb-6">Quarterly rotation refreshes 25% of the holdout. Three of nine attacks rotate per quarter. High-impact attacks rotate more frequently than stable attacks.</P>
              <P>Full benchmark results published at{' '}<InlineLink href="https://transparency.deadmeter.com/benchmarks" external>transparency.deadmeter.com/benchmarks</InlineLink>.</P>
            </section>

            <section id="section-5" className="mb-[80px]">
              <SectionHeading num="§5">Versioning</SectionHeading>
              <P className="mb-6">The methodology uses semantic versioning combined with cryptographic hashes.</P>
              <TableWrap>
                {([
                  ['v1.0.1', 'Patch', 'Bug fixes that do not change AUROC.'                                                                                                                                ],
                  ['v1.1',   'Minor', 'Refinements with AUROC change under 2 percentage points. Backward compatibility is preserved for historical comparison.'                                            ],
                  ['v2.0',   'Major', 'Breaking changes such as recalibrated coefficients, redefined streams, or overhauled calibration baselines. Historical Pulse numbers may not be directly comparable.'],
                ] as [string, string, string][]).map(([ver, type, desc], i, arr) => (
                  <div key={ver} className={'grid grid-cols-[72px_80px_1fr] items-start gap-4 px-5 py-4' + (i < arr.length - 1 ? ' border-b border-[var(--border)]' : '')}>
                    <code className="text-[13px] text-[var(--accent)] pt-[2px]">{ver}</code>
                    <span className="font-mono text-[11px] uppercase tracking-[0.04em] text-[var(--text-tertiary)] pt-[2px]">{type}</span>
                    <span className="text-[15px] text-[var(--text-secondary)] leading-[1.65]">{desc}</span>
                  </div>
                ))}
              </TableWrap>
              <P className="mb-6">Off-cycle minor increments may occur when a major adversarial discovery or significant accuracy regression triggers a methodology update.</P>
              <P>Every Cert and every Pulse publication includes the active methodology version and its SHA-256 hash. Historical methodology pages remain accessible at{' '}<InlineLink href="/methodology/v1-0">deadmeter.com/methodology/v1-0</InlineLink>,{' '}<InlineLink href="/methodology/v1-1">v1-1</InlineLink>, and so on.</P>
            </section>

            <section id="section-6" className="mb-[80px]">
              <SectionHeading num="§6">Single-operator transparency</SectionHeading>
              <P className="mb-6">This work is produced by one person with one tester.</P>
              <P className="mb-6">Methodology development is performed by Pavel Ishchin. Backend testing and infrastructure validation is performed by Daniil. Marketing and publication formatting is performed by Evelina. There is no formal institutional review board, no redundant validation pipeline, and no independent replication baked into the workflow.</P>
              <P className="mb-6">This is disclosed openly because it affects how findings should be weighted. Single-operator measurements should be treated as one signal among several, not as definitive evidence. Corroborating evidence from independent sources should be weighted highly.</P>
              <P>The methodology is published openly to allow independent replication. Reference implementation is available as a Docker container for 5+ year reproducibility. Calibration corpus access is documented.</P>
            </section>

            <section id="section-7" className="mb-[80px]">
              <SectionHeading num="§7">Apolitical scope</SectionHeading>
              <P className="mb-6">Deadmeter does not measure or report on political content. No elections. No government information operations. No active conflicts. No partisan advocacy. No identity politics.</P>
              <P className="mb-6">This is a permanent commitment, not a temporary positioning. The apolitical scope is implemented through:</P>
              <Bullet items={[
                'Stream selection criteria that exclude political subreddits, political blog sources, and political forums',
                <span key="ner">A NER-based filter in <InlineLink href="/tools/bs-meter">BS Meter</InlineLink> and <InlineLink href="/tools/dii">Dead Internet Index</InlineLink> that rejects inputs above a threshold density of named political entities</span>,
                'Sponsor category restrictions that auto-reject political organizations and campaigns',
                'Coverage limitations on tools applicable to politically-charged content',
              ]} />
              <P className="mt-6">The scope deliberately privileges defensibility over breadth. Three clean streams of technical discourse are stronger than four streams including a politically-charged one.</P>
            </section>

            <section id="section-8" className="mb-[80px]">
              <SectionHeading num="§8">Limitations</SectionHeading>
              <div className="bg-[var(--surface-warm)] border-l-4 border-[var(--accent)] px-8 py-6 mb-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-secondary)] mb-3">Disclosure</p>
                <p className="font-serif text-[20px] leading-[1.45] text-[var(--text-primary)] italic">
                  These limitations are part of the methodology record, not footnotes.
                </p>
              </div>
              <ol className="list-none p-0 m-0">
                {([
                  ['Population-level inference only.', 'All ecosystem scores describe statistical distributions across many documents within a monitored stream. They cannot label individual posts as AI-generated or human-authored at the document level with the same confidence.'],
                  ['Pre-2022 baseline contamination.', 'Our reference corpus for human-only writing is drawn from 2018-2021 sources. Estimated AI-generated contamination of this baseline is 1-5%, meaning the absolute floor of all measurements is offset by an unknown small amount.'],
                  ['Adversarial uncertainty exceeds reported confidence intervals.', 'CIs reflect statistical noise under typical conditions. They do not account for actively adversarial inputs (paraphrased AI text, mixed-authorship documents, stylometric obfuscation), where actual error can be substantially larger than the band suggests.'],
                  ['English text only (v1.0).', 'The calibration corpus is English-language. Non-English documents are rejected at input validation. Multilingual support is out of scope for this release.'],
                  ['Apolitical methodology.', 'No tool in the suite uses topic, sentiment, or political content as a feature. All measurements are structural-only. The system is intentionally blind to what a text is about.'],
                  ['Stream selection bias.', 'The streams we monitor are chosen by our team based on coverage, accessibility, and platform diversity. They are not a random sample of the open internet. Generalization beyond the monitored set should be made cautiously.'],
                  ['Single-operator project.', 'This work is produced and maintained by one person with one tester. We do not currently have institutional review, redundant validation, or independent replication. Treat findings accordingly and weigh corroborating evidence highly.'],
                  ['Detection ceiling on adversarial text.', 'Following Sadasivan et al. (2023), no statistical detector can reliably distinguish AI-generated text from human-written text under sufficient paraphrasing. Our tools degrade gracefully under paraphrase attacks but cannot provide proof against motivated adversaries.'],
                  ['TPS_behavioral signals are observational proxies.', 'The five behavioral signals (NGCS, CRJ, AAR, IPTD, EA) are calibrated on stream-level patterns. They have not been validated against ground-truth labeling at the individual account level and should not be used to infer intent or identity for any specific account.'],
                  ['Reservoir computing component excluded from v1.0.', 'The candidate fifth feature based on reservoir computing methodology is held back pending Phase 0 empirical validation. All scores reported in v1.0 use the four-feature configuration with the f3 by f4 interaction term only.'],
                ] as [string, string][]).map(([title, body], i) => (
                  <li key={i} className="grid grid-cols-[44px_1fr] items-start gap-4 border-t border-[var(--border)] py-6">
                    <span className="font-mono text-[13px] text-[var(--text-tertiary)] pt-[2px] font-feature-tnum">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="text-[17px] font-medium text-[var(--text-primary)] leading-[1.5] mb-2">{title}</p>
                      <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7]">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="section-9" className="mb-[80px]">
              <SectionHeading num="§9">Multi-source closure</SectionHeading>
              <P className="mb-6">The methodology is anchored across multiple sources to avoid single-source failure modes.</P>
              <ColLabel label="Three primary anchors" />
              <Bullet items={[
                'arXiv preprint (planned for publication within 30 days of launch)',
                'This methodology page (versioned, hash-anchored, immutable archive)',
                <span key="benchmarks">Public adversarial benchmarks at <InlineLink href="https://transparency.deadmeter.com/benchmarks" external>transparency.deadmeter.com</InlineLink></span>,
              ]} />
              <div className="mt-6">
                <ColLabel label="Additional accountability" />
                <Bullet items={[
                  'Publicly downloadable calibration corpus subsets',
                  'Reference Docker container for reproducibility',
                  'Quarterly transparency reports',
                  'Open-source extraction code for behavioral signals',
                ]} />
              </div>
              <P className="mt-6">When external pressure or methodology disputes occur, multiple independent verification paths exist. No single platform takedown or single regulatory action can erase the methodology record.</P>
            </section>

            <section id="section-10" className="mb-[80px]">
              <SectionHeading num="§10">Sadasivan boundary</SectionHeading>
              <P className="mb-6">
                Sadasivan et al. (2023, <InlineLink href="https://arxiv.org/abs/2303.11156" external>arXiv:2303.11156</InlineLink>) demonstrated a fundamental limitation: under sufficient recursive paraphrasing, any binary classifier for AI-generated text mathematically converges to random performance. This is not a flaw in any specific classifier. It is an information-theoretic property of the task.
              </P>
              <P className="mb-6">For <code>IMS_text</code> (per-document Cert), the boundary applies directly. Death Certificate cannot provide an absolute verdict on authorship under recursive paraphrasing.</P>
              <P className="mb-6">For <code>IMS_ecosystem</code> (population-level), the boundary applies indirectly. Aggregation over many documents bypasses the per-document boundary, but sufficiently sophisticated coordinated attacks can still degrade the aggregate signal substantially.</P>
              <ColLabel label="Additional impossibility results" />
              <TableWrap>
                {([
                  ['Barak (ICML 2023)',            'https://arxiv.org/abs/2305.17652', 'random walk attacks defeat watermarking when quality oracles and perturbation oracles are available'],
                  ['Christ-Gunn-Zamir (COLT 2024)','https://arxiv.org/abs/2401.01223', 'undetectable watermarks via one-way functions face their own impossibility theorem'              ],
                  ['SIRA-attack (ICML 2025)',       '',                                 'watermark removal at approximately $0.88 per million tokens'                                     ],
                ] as [string, string, string][]).map(([ref, url, desc], i, arr) => (
                  <div key={ref} className={'grid grid-cols-[200px_1fr] items-start gap-4 px-5 py-4' + (i < arr.length - 1 ? ' border-b border-[var(--border)]' : '')}>
                    <span className="font-mono text-[12px] text-[var(--text-primary)] leading-[1.5] pt-[2px]">
                      {url ? <InlineLink href={url} external>{ref}</InlineLink> : ref}
                    </span>
                    <span className="text-[15px] text-[var(--text-secondary)] leading-[1.65]">{desc}</span>
                  </div>
                ))}
              </TableWrap>
              <div className="bg-[var(--surface-dark)] px-10 py-10 mt-8 relative overflow-hidden">
                <div className="absolute top-8 left-10 w-10 h-1 bg-[var(--accent)]" />
                <p className="font-serif text-[var(--text-on-dark)] leading-[1.25] tracking-[-0.015em] mt-6 mb-4" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
                  We do not claim immunity. We claim calibrated, honest, versioned measurement.
                </p>
                <p className="text-[15px] text-[var(--text-on-dark-secondary)] leading-[1.65]">
                  Death Certificate is presented as a diagnostic instrument, not adjudicative. IMS_ecosystem is presented with explicit adversarial degradation factors.
                </p>
              </div>
            </section>

            <div className="border-t-2 border-[var(--text-primary)] bg-[var(--surface-warm)] p-8 mt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] mb-6">Methodology record</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {([
                  ['Version',                  'v1.0'          ],
                  ['Hash (SHA-256)',            '········'      ],
                  ['Reference implementation', 'deadmeter:v1.0'],
                  ['Active calibration corpus','C[X]_Q[Y]_2026'],
                  ['Last updated',             '2026-MM-DD'    ],
                  ['Next quarterly review',    'TBD'           ],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-1">{label}</p>
                    <p className="font-mono text-[13px] text-[var(--text-primary)]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border)] pt-6 flex flex-wrap gap-x-6 gap-y-3">
                <span className="text-[14px] text-[var(--text-tertiary)]">Download arXiv preprint (coming soon)</span>
                <InlineLink href="/methodology/v1-0">Methodology archive</InlineLink>
                <InlineLink href="https://transparency.deadmeter.com/benchmarks" external>Adversarial benchmarks</InlineLink>
              </div>
            </div>

          </article>
        </div>
      </div>
    </div>
  );
}