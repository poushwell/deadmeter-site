/**
 * app/cert/[hash]/CertResultClient.tsx — Client Component
 *
 * Death Certificate result visualization.
 * Handles copy-to-clipboard interaction.
 *
 * TZ_02 §7.5 — horizontal bar, muted colors per label
 * TZ_02 §7.6 — disclaimer: visible, not collapsed, full size
 * TZ_02 §7.7 — share section
 * TZ_02 §7.10 — anti-patterns: NO animated bar fill, NO confetti,
 *               NO auto-play, disclaimer NOT hidden
 * TZ_03 §7.7, §7.8 verbatim texts
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQBlock } from '@/components/shared/FAQBlock';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertResult {
  hash: string;
  ims_text: number;
  ci_low: number;
  ci_high: number;
  verbal_label: 'Live' | 'Hybrid' | 'Synthetic' | 'Dead';
  methodology_version: string;
  methodology_hash: string;
  text_excerpt: string | null;
  created_at: string;
  signed_payload: string | null;
}

interface Props {
  result: CertResult;
}

// ─── Label config (TZ_02 §7.5 muted color scheme) ────────────────────────────
// Live 0-25: desaturated green
// Hybrid 26-55: amber
// Synthetic 56-80: warm orange
// Dead 81-100: desaturated red
// TZ_02 §7.10: no animated bar fill, no confetti

const LABEL_CONFIG = {
  Live:      { color: '#4A7C59', bg: '#EAF3DE', range: '0–25' },
  Hybrid:    { color: '#8C6D1F', bg: '#FDF3DC', range: '26–55' },
  Synthetic: { color: '#B85C00', bg: '#FAEEDA', range: '56–80' },
  Dead:      { color: '#8B2A2A', bg: '#F8E8E8', range: '81–100' },
} as const;

// ─── Verbal label descriptions (TZ_03 §7.8 verbatim) ─────────────────────────

function getVerbalDescription(
  label: CertResult['verbal_label'],
  ciWidth: number
): string {
  if (label === 'Live') {
    return 'Strong signature of human authorship under normal conditions.';
  }
  if (label === 'Hybrid') {
    if (ciWidth > 20) {
      return 'Mixed signature with elevated uncertainty. The score is ambiguous and the confidence interval is wide. Treat as inconclusive.';
    }
    return 'Mixed signature. The document shows neither strong human nor strong AI patterns. This may indicate human-AI collaborative authorship, translation, heavy editing, or content from a distribution not well-covered by our calibration corpus.';
  }
  if (label === 'Synthetic') {
    return 'Strong signature of AI-generated patterns under our calibration.';
  }
  // Dead
  return 'Very strong signature of AI generation, often combined with other markers of automated content production.';
}

// ─── FAQ (compact — TZ_02 §7.2 State 2 section 8, TZ_03 §7.11) ──────────────

const faqItems = [
  {
    question: 'How long does analysis take?',
    answer: '30 to 60 seconds for a typical document. Longer for documents near the maximum length, or when the model is busy with other requests.',
  },
  {
    question: 'Is my submitted text stored?',
    answer: 'Yes, for 30 days after submission to support permanent URL rendering. After 30 days the original text is deleted; the Cert metadata (score, verdict, hash) remains. Do not submit confidential content. The privacy policy details retention policies.',
  },
  {
    question: 'Can I delete my Cert?',
    answer: 'Contact us with the Cert URL and reason. We honor deletion requests within 14 days for Cert authors who can verify control of the original submission.',
  },
];

// ─── Shared link style ────────────────────────────────────────────────────────

const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] ' +
  '[text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] ' +
  'hover:decoration-[var(--text-primary)] transition-colors';

// ─── Component ────────────────────────────────────────────────────────────────

export function CertResultClient({ result }: Props) {
  const [copied, setCopied] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const labelConfig = LABEL_CONFIG[result.verbal_label];
  const ciWidth = result.ci_high - result.ci_low;
  const verbalDesc = getVerbalDescription(result.verbal_label, ciWidth);
  const permalink = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com'}/cert/${result.hash}`;

  const displayDate = new Date(result.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  async function handleCopy() {
    await navigator.clipboard.writeText(permalink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main id="main-content">

      {/* ── RESULT HERO ─────────────────────────────────────────────────────
          TZ_03 §7.7: H1, Subtitle: Methodology v1.0 · [hash] · [timestamp]
          TZ_02 §7.2 State 2 section 2
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="result-heading"
        className="border-b border-[var(--border)]"
      >
        <div className="container pt-[64px] md:pt-[80px] pb-[48px] md:pb-[56px]">
          <div className="max-w-[720px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-4">
              Permanent record
            </p>
            <h1
              id="result-heading"
              className="font-serif font-bold text-[var(--text-primary)] leading-[1.05] tracking-[-0.025em] mb-3"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Death Certificate
            </h1>
            {/* TZ_03 §7.7: Subtitle format verbatim */}
            <p className="font-mono text-[12px] tracking-[0.06em] text-[var(--text-tertiary)]">
              Methodology {result.methodology_version} · {result.methodology_hash} · {displayDate}
            </p>
          </div>
        </div>
      </section>


      {/* ── RESULT TEMPLATE ─────────────────────────────────────────────────
          TZ_03 §7.7: large IMS score, verbal label badge, bar, verdict
          TZ_02 §7.5: horizontal bar only, muted colors, label primary
          TZ_02 §7.10: NO animated bar fill (static render)
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="score-heading"
        className="border-b border-[var(--border)] py-[56px] md:py-[72px]"
      >
        <div className="container">
          <div className="max-w-[720px]">

            {/* TZ_02 §7.5: label PRIMARY (largest), score secondary (supporting) */}
            {/* Visual hierarchy: label badge dominant, score beneath it */}
            <div className="mb-4">
              {/* Label — primary, largest element */}
              <div
                id="score-heading"
                className="font-serif font-bold leading-[0.95] tracking-[-0.025em] mb-3"
                style={{ fontSize: 'clamp(56px, 9vw, 88px)', color: labelConfig.color }}
              >
                {result.verbal_label}
              </div>
              {/* Score — secondary, smaller than label */}
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono font-medium leading-[1] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 34px)', fontFeatureSettings: '"tnum" 1', color: 'var(--text-primary)' }}
                >
                  {result.ims_text.toFixed(1)}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  IMS_text
                </span>
              </div>
            </div>

            {/* TZ_03 §7.7: IMS_text: [score] ± [CI/2] */}
            <p className="font-mono text-[13px] tracking-[0.04em] text-[var(--text-tertiary)] mb-8">
              IMS_text {result.ims_text.toFixed(1)} · 95% CI [{result.ci_low.toFixed(1)}, {result.ci_high.toFixed(1)}]
            </p>

            {/* Horizontal bar visualization — TZ_02 §7.5 */}
            {/* TZ_02 §7.10: NOT animated on load */}
            <div className="mb-2" aria-label={`IMS score ${result.ims_text.toFixed(1)} on scale 0 to 100`}>
              {/* Track */}
              <div className="relative h-[8px] bg-[var(--border)] w-full">
                {/* Label zone background */}
                <div
                  className="absolute h-full opacity-30"
                  style={{
                    left: 0,
                    width: `${result.ims_text}%`,
                    backgroundColor: labelConfig.color,
                  }}
                  aria-hidden="true"
                />
                {/* CI shaded band */}
                <div
                  className="absolute h-full opacity-60"
                  style={{
                    left: `${result.ci_low}%`,
                    width: `${result.ci_high - result.ci_low}%`,
                    backgroundColor: labelConfig.color,
                  }}
                  aria-hidden="true"
                />
                {/* Score tick */}
                <div
                  className="absolute w-[3px] h-[16px] -top-[4px]"
                  style={{
                    left: `${result.ims_text}%`,
                    backgroundColor: labelConfig.color,
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Scale labels */}
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--text-tertiary)] mb-8">
              <span>0 Live</span>
              <span>Hybrid</span>
              <span>Synthetic</span>
              <span>Dead 100</span>
            </div>

            {/* Verdict text — TZ_03 §7.7 format: "This document shows [desc]." */}
            <div
              className="border-l-4 pl-5 py-1"
              style={{ borderLeftColor: labelConfig.color }}
            >
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                {/* TZ_03 §7.7: "This document shows [verbal label description]. Key signals: [1-2 line summary]." */}
                {/* TODO: append "Key signals: [summary]" when backend returns signal breakdown */}
                This document shows {verbalDesc}
              </p>
            </div>

            {/* Text excerpt if available */}
            {result.text_excerpt && (
              <div className="mt-6 p-4 border border-[var(--border)] bg-[var(--paper)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">
                  Analyzed text (first 200 chars)
                </p>
                <p className="font-mono text-[13px] text-[var(--text-secondary)] leading-[1.60]">
                  {result.text_excerpt}
                </p>
              </div>
            )}

          </div>
        </div>
      </section>




      {/* ── LIMITATIONS ──────────────────────────────────────────────────────
          TZ_02 §7.2 State 2 section 5: visible, not collapsed
          TZ_03 §7.9 verbatim
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="result-limitations-heading"
        className="border-b border-[var(--border)] py-[48px] md:py-[56px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2
              id="result-limitations-heading"
              className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-6"
            >
              What this tool cannot do
            </h2>
            <div className="space-y-4 text-[16px] text-[var(--text-secondary)] leading-[1.70]">
              <p>It cannot prove authorship. It can suggest a statistical pattern consistent or inconsistent with AI generation, with calibrated confidence. Proof of authorship requires multiple independent forms of evidence.</p>
              <p>It cannot detect AI text under recursive paraphrasing. This is a fundamental limit, not a flaw of any specific tool. See the methodology page §10 (Sadasivan boundary) for the formal result and its implications.</p>
              <p>It cannot detect AI text in mixed human-AI documents reliably. Hybrid authorship produces ambiguous signatures. The verbal label Hybrid covers this case explicitly.</p>
              <p>It cannot replace editorial judgment. Use Death Certificate as a diagnostic signal in your investigative workflow, not as a substitute for journalistic verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER BLOCK ────────────────────────────────────────────────
          TZ_03 §7.7 verbatim — full 3 paragraphs
          TZ_02 §7.6: visible, not collapsed, full text size, subtle bg
          TZ_02 §7.10: do NOT hide disclaimer behind "show more"
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-label="Disclaimer"
        className="border-b border-[var(--border)] py-[48px] md:py-[64px]"
      >
        <div className="container">
          <div
            className="max-w-[720px] border border-[var(--border)] bg-[var(--paper)] p-6 md:p-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-[var(--text-tertiary)] mb-5">
              Important disclaimer
            </p>
            <div className="space-y-4 text-[16px] text-[var(--text-secondary)] leading-[1.70]">
              <p>
                This Death Certificate reflects a statistical signature of the text. It is not proof of authorship, not a verdict on authenticity, and not a measure of truth or falsity of any claim it contains.
              </p>
              <p>
                The document may have been edited, paraphrased, translated, or generated by a system not represented in our calibration corpus. The underlying IMS_text score is robust against casual rewriting but can be defeated by deliberate paraphrasing or skilled human editing. Confidence intervals reflect statistical noise under typical conditions; they do not bound error against motivated adversaries.
              </p>
              <p>
                Use this report as a diagnostic signal in your investigation, one piece of evidence among many. Do not use it as grounds for public accusation, employment decisions, academic discipline, or legal action without independent corroboration.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── METHODOLOGY DISCLOSURE ──────────────────────────────────────────
          TZ_03 §7.7: collapsed by default
          TZ_02 §7.2 State 2 section 6: collapsed by default
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        className="border-b border-[var(--border)]"
        aria-label="Methodology disclosure"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <button
              type="button"
              onClick={() => setMethodologyOpen((o) => !o)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={methodologyOpen}
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                {methodologyOpen ? '▼' : '▶'} Methodology details
              </span>
            </button>

            {methodologyOpen && (
              <div className="pb-6 space-y-2 font-mono text-[13px] text-[var(--text-secondary)] tracking-[0.03em]">
                <p>Methodology version: {result.methodology_version}</p>
                <p>Hash: {result.methodology_hash}</p>
                <p>Analyzed at: {displayDate}</p>
                <p>Active calibration corpus: C1_Q2_2026</p>  {/* TODO: dynamic value from backend */}
                <p>Reproducibility: same input + same version produces same Cert</p>
                <p className="pt-2">
                  <Link href="/methodology" className={lnk}>
                    Read full methodology →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* ── PERMALINK AND SHARE ─────────────────────────────────────────────
          TZ_03 §7.7: Permanent URL + Copy + X + LinkedIn
          TZ_02 §7.7: copy, X, LinkedIn
      ──────────────────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="share-heading"
        className="border-b border-[var(--border)] py-[48px] md:py-[64px]"
      >
        <div className="container">
          <div className="max-w-[720px]">
            <h2
              id="share-heading"
              className="font-serif text-[22px] font-bold text-[var(--text-primary)] leading-[1.20] tracking-[-0.015em] mb-6"
            >
              Permanent URL
            </h2>

            {/* URL display + copy */}
            <div className="flex gap-0 mb-6">
              <div className="flex-1 border border-[var(--border)] border-r-0 bg-[var(--paper)] px-4 py-3 font-mono text-[13px] text-[var(--text-secondary)] overflow-hidden text-ellipsis whitespace-nowrap">
                {permalink}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-6 py-3 text-[13px] font-medium border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors whitespace-nowrap"
                aria-label="Copy permalink to clipboard"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>

            {/* Share buttons */}
            <div className="flex gap-3">
              <a
                href={`https://x.com/intent/post?url=${encodeURIComponent(permalink)}&text=${encodeURIComponent(`Death Certificate: ${result.verbal_label} ${result.ims_text.toFixed(1)} via @deadmeter`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Share to X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-colors"
              >
                Share to LinkedIn
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ── CERT FOOTER ─────────────────────────────────────────────────────
          TZ_03 §7.7: cryptographic signature footer
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--border)] py-5">
        <div className="container">
          <div className="max-w-[720px] flex flex-wrap gap-x-8 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            <span>Cryptographically signed · Ed25519</span>
            {result.signed_payload && (
              <Link href="/methodology#verification" className={lnk}>
                Verify signature
              </Link>
            )}
            <Link href="mailto:support@deadmeter.com" className={lnk}>
              Report issues
            </Link>
          </div>
        </div>
      </section>


      {/* ── FAQ (compact) ───────────────────────────────────────────────────
          TZ_02 §7.2 State 2 section 8
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="py-[48px] md:py-[64px]">
        <div className="container">
          <div className="max-w-[720px]">
            <FAQBlock items={faqItems} includeSchema={false} />
            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-[var(--border)]">
              <Link href="/cert" className={lnk}>Run another Cert</Link>
              <Link href="/methodology" className={lnk}>Methodology</Link>
              <Link href="/methodology#section-1" className={lnk}>Methodology §1 — Features</Link>
              <Link href="/pricing" className={lnk}>Pricing</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}