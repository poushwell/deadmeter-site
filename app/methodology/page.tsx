import type { Metadata } from 'next';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';
import MethodologyContent from './MethodologyContent';

export const metadata: Metadata = buildMetadata({
  title: 'Methodology',
  description:
    'Full methodology disclosure for IMS_ecosystem and IMS_text measurements. Architecture A specification, calibration baseline, adversarial robustness, Sadasivan boundary, versioning policy, limitations.',
  path: '/methodology',
  ogImage: '/og/methodology.png',
});

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: 'Deadmeter Methodology v1.0',
  datePublished: '2026-05-19',
  author:    { '@type': 'Person', name: 'Pavel Ishchin' },
  publisher: { '@type': 'Person', name: 'Pavel Ishchin' },
  description:
    'Methodology specification for Deadmeter measurement infrastructure including Architecture A, calibration baseline, and adversarial benchmark suite.',
  url:     'https://deadmeter.com/methodology',
  version: '1.0',
};

export default function Page() {
  return (
    <>
      <SchemaMarkup schema={schema} />
      <MethodologyContent />
    </>
  );
}