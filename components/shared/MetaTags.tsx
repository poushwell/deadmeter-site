import type { Metadata } from 'next';

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage = '/og/home.png',
}: PageMetaOptions): Metadata {
  const fullTitle = `${title} · Deadmeter`;
  const url      = `https://deadmeter.com${path}`;
  const image    = `https://deadmeter.com${ogImage}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}