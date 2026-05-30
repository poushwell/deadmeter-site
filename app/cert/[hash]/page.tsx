/**
 * app/cert/[hash]/page.tsx
 *
 * /cert/[hash] — Death Certificate result page.
 * Server Component: fetches result from Supabase, renders static result.
 *
 * TZ_02 §7.2 State 2 — result page structure (9 sections)
 * TZ_02 §7.5 — horizontal bar, muted color scheme, label visual hierarchy
 * TZ_02 §7.6 — disclaimer: visible, not collapsed, full text size
 * TZ_02 §7.7 — share section: copy link, X, LinkedIn
 * TZ_02 §7.8 — /cert/* noindex (set via metadata)
 * TZ_02 §7.10 — anti-patterns: no animated bar, no confetti, no fake %
 * TZ_03 §7.7, §7.8 — all texts verbatim
 * TZ_03 §7.11 — compact FAQ on result page
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { CertResultClient } from './CertResultClient';

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

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getCertResult(hash: string): Promise<CertResult | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cert_results')
    .select(
      'hash, ims_text, ci_low, ci_high, verbal_label, methodology_version, methodology_hash, text_excerpt, created_at, signed_payload'
    )
    .eq('hash', hash)
    .maybeSingle();

  if (error || !data) return null;
  return data as CertResult;
}

// ─── Metadata (TZ_02 §7.8: /cert/[hash] not indexed) ─────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}): Promise<Metadata> {
  const { hash } = await params;
  const result = await getCertResult(hash);

  if (!result) return {};

  const score = result.ims_text.toFixed(1);
  const label = result.verbal_label;

  return {
    title: `Death Certificate · ${label} ${score} · Deadmeter`,
    description: `IMS_text ${score} (95% CI [${result.ci_low.toFixed(1)}, ${result.ci_high.toFixed(1)}]). Verbal label: ${label}. Methodology ${result.methodology_version}.`,
    robots: {
      index: false,   // TZ_02 §7.8: result pages not indexed
      follow: false,
    },
    openGraph: {
      title: `Death Certificate · ${label} ${score}`,
      description: `IMS_text ${score} · ${label} · Methodology ${result.methodology_version}`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deadmeter.com'}/cert/${hash}`,
    },
    twitter: {
      card: 'summary_large_image',  // TZ_02 §7.7
    },
    alternates: {
      canonical: `https://deadmeter.com/cert/${hash}`,
    },
  };
}

// ─── Schema ───────────────────────────────────────────────────────────────────

function buildSchema(result: CertResult) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AnalysisNewsArticle',
    name: `Death Certificate · ${result.verbal_label} ${result.ims_text.toFixed(1)}`,
    dateCreated: result.created_at,
    url: `https://deadmeter.com/cert/${result.hash}`,
    publisher: {
      '@type': 'Organization',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CertHashPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const result = await getCertResult(hash);

  if (!result) notFound();

  // TypeScript narrowing
  const r = result as NonNullable<typeof result>;
  const schema = buildSchema(r);

  return (
    <>
      <SchemaMarkup schema={schema} />
      <CertResultClient result={r} />
    </>
  );
}