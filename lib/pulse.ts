/**
 * lib/pulse.ts
 *
 * Reads Pulse issue markdown files from /content/pulse/.
 * Parses frontmatter via gray-matter, renders body via remark.
 *
 * TZ_04 §5.2: gray-matter + remark + remark-html
 * TZ_04 §19.1: files at /content/pulse/[slug].md
 *
 * Required frontmatter:
 *   title, date, issue, deck,
 *   ims_ecosystem, ci_low, ci_high,
 *   methodology_version, methodology_hash
 *
 * Optional frontmatter:
 *   sponsor, sponsor_category, sponsor_amount
 *
 * Install dependencies (if not already):
 *   npm install gray-matter remark remark-html
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pulse');

export interface PulseIssue {
  slug: string;
  title: string;
  date: string;            // ISO 8601: "2026-06-03"
  issue: number;           // issue number
  deck: string;            // subtitle / lead sentence
  ims_ecosystem: number;   // 0–100
  ci_low: number;
  ci_high: number;
  methodology_version: string;
  methodology_hash: string;
  sponsor?: string;
  sponsor_category?: string;
  sponsor_amount?: string;
  contentHtml: string;     // rendered HTML body
}

/**
 * Returns all slugs from /content/pulse/*.md.
 * Used by generateStaticParams.
 */
export async function getAllPulseSlugs(): Promise<string[]> {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/**
 * Returns all issues sorted by date descending (newest first).
 * Used by /pulse archive page.
 */
export async function getAllPulseIssues(): Promise<Omit<PulseIssue, 'contentHtml'>[]> {
  const slugs = await getAllPulseSlugs();

  const issues = slugs.map((slug) => {
    const fullPath = path.join(CONTENT_DIR, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title:               String(data.title ?? ''),
      date:                data.date instanceof Date
                       ? data.date.toISOString().slice(0, 10)
                       : String(data.date ?? ''),
      issue:               Number(data.issue ?? 0),
      deck:                String(data.deck ?? ''),
      ims_ecosystem:       Number(data.ims_ecosystem ?? 0),
      ci_low:              Number(data.ci_low ?? 0),
      ci_high:             Number(data.ci_high ?? 0),
      methodology_version: String(data.methodology_version ?? 'v1.0'),
      methodology_hash:    String(data.methodology_hash ?? ''),
      sponsor:             data.sponsor ? String(data.sponsor) : undefined,
      sponsor_category:    data.sponsor_category ? String(data.sponsor_category) : undefined,
      sponsor_amount:      data.sponsor_amount ? String(data.sponsor_amount) : undefined,
    };
  });

  // Sort newest first
  return issues.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Returns a single issue by slug, with rendered HTML body.
 * Returns null if file not found.
 */
export async function getPulseIssue(slug: string): Promise<PulseIssue | null> {
  const fullPath = path.join(CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    title:               String(data.title ?? ''),
    date:                data.date instanceof Date
                       ? data.date.toISOString().slice(0, 10)
                       : String(data.date ?? ''),
    issue:               Number(data.issue ?? 0),
    deck:                String(data.deck ?? ''),
    ims_ecosystem:       Number(data.ims_ecosystem ?? 0),
    ci_low:              Number(data.ci_low ?? 0),
    ci_high:             Number(data.ci_high ?? 0),
    methodology_version: String(data.methodology_version ?? 'v1.0'),
    methodology_hash:    String(data.methodology_hash ?? ''),
    sponsor:             data.sponsor ? String(data.sponsor) : undefined,
    sponsor_category:    data.sponsor_category ? String(data.sponsor_category) : undefined,
    sponsor_amount:      data.sponsor_amount ? String(data.sponsor_amount) : undefined,
    contentHtml,
  };
}