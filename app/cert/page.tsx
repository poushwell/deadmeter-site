/**
 * app/cert/page.tsx
 *
 * /cert — Death Certificate input page.
 * Server Component: exports metadata, renders CertClient.
 *
 * TZ_02 §7.2 State 1 — input page structure (8 sections)
 * TZ_03 §7.1 meta, §7.2 schema, §7.3 hero, §7.4 what it does,
 *            §7.5 tool UI, §7.9 limitations, §7.10 methodology,
 *            §7.11 FAQ
 * TZ_02 §7.10 anti-patterns
 * TZ_02 §7.9 cross-links
 */

import type { Metadata } from 'next';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import { CertClient } from './CertClient';

// ─── Metadata (TZ_03 §7.1) ───────────────────────────────────────────────────

export const metadata: Metadata = buildMetadata({
  title: 'Death Certificate',
  description:
    'Statistical signature analysis for a single document. Calibrated IMS_text score with 95% confidence interval, verbal label, methodology disclosure, cryptographic signature.',
  path: '/cert',
});

// ─── Schema (TZ_03 §7.2) ─────────────────────────────────────────────────────

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Death Certificate',
  applicationCategory: 'AnalyticsApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'Statistical signature analysis for a single document with calibrated confidence intervals.',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CertPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />
      <CertClient />
    </>
  );
}