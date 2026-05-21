import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/components/shared/MetaTags';
import { SchemaMarkup } from '@/components/shared/SchemaMarkup';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  // NOTE: TZ_03 §11.2 does not provide a meta description for this page.
  // TODO: confirm with Pavel before launch.
  description:
    'Terms of Service for Deadmeter. Service description, acceptable use, pricing, refund policy, and liability limitations.',
  path: '/terms',
});

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://deadmeter.com/terms',
      name: 'Terms of Service',
      url: 'https://deadmeter.com/terms',
      description:
        'Terms of Service for Deadmeter. Service description, acceptable use, pricing, refund policy, and liability limitations.',
      dateModified: '2026-05-20',
      isPartOf: { '@id': 'https://deadmeter.com' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://deadmeter.com/#organization',
      name: 'Deadmeter',
      url: 'https://deadmeter.com',
      logo: 'https://deadmeter.com/logo.png',
      founder: { '@type': 'Person', name: 'Pavel Ishchin' },
      description: 'Internet content tracking with calibrated confidence intervals.',
    },
  ],
};

// Inline link style for body text links
const lnk =
  'underline decoration-solid decoration-[var(--accent)] underline-offset-[3px] [text-decoration-skip-ink:none] [text-decoration-thickness:1.5px] hover:decoration-[var(--text-primary)] transition-colors';

// TOC link style
const tocLnk =
  'text-[14px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors';

// Reusable section divider
function Divider() {
  return <div className="border-t border-[var(--border)] mb-12" aria-hidden="true" />;
}

export default function TermsPage() {
  return (
    <>
      <SchemaMarkup schema={schema} />

      <main id="main-content">
        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <header className="border-b border-[var(--border)] bg-[var(--bg)]">
          <div className="container-reading pt-[80px] md:pt-[20px] pb-[48px] md:pb-[44px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-6">
              Legal
            </p>
            <h1 className="font-serif text-[38px] md:text-[44px] font-bold text-[var(--text-primary)] leading-[1.10] tracking-[-0.02em] mb-6">
              Terms of Service
            </h1>
            <p className="font-mono text-[12px] text-[var(--text-tertiary)] tracking-[0.04em]">
              Last updated: May 20, 2026
            </p>
          </div>
        </header>

        {/* ── LEGAL CROSS-NAV ──────────────────────────────────────────── */}
        <nav
          aria-label="Legal pages"
          className="border-b border-[var(--border)] bg-[var(--bg)]"
        >
          <div className="container-reading">
            <div className="flex items-center gap-6 py-3">
              <Link
                href="/privacy"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Privacy
              </Link>
              <span className="text-[13px] font-medium text-[var(--text-primary)] border-b-2 border-[var(--accent)] pb-0.5">
                Terms
              </span>
              <Link
                href="/cookies"
                className="text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </nav>

        {/* ── ARTICLE CONTENT ──────────────────────────────────────────── */}
        <article>
          <div className="container-reading pt-[40px] pb-[80px] md:pb-[100px]">

            {/* TABLE OF CONTENTS */}
            <nav aria-label="Table of contents" className="mb-12 p-6 border border-[var(--border)] bg-[var(--surface-warm)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-5">
                Contents
              </p>
              <ol className="list-none p-0 m-0 space-y-2 columns-1 sm:columns-2">
                <li><a href="#section-1" className={tocLnk}>§1 Acceptance of terms</a></li>
                <li><a href="#section-2" className={tocLnk}>§2 Service description</a></li>
                <li><a href="#section-3" className={tocLnk}>§3 Account responsibilities</a></li>
                <li><a href="#section-4" className={tocLnk}>§4 Pricing and payments</a></li>
                <li><a href="#section-5" className={tocLnk}>§5 Free tier commitment</a></li>
                <li><a href="#section-6" className={tocLnk}>§6 Tool limitations and disclaimers</a></li>
                <li><a href="#section-7" className={tocLnk}>§7 Cert content rights</a></li>
                <li><a href="#section-8" className={tocLnk}>§8 Apolitical scope</a></li>
                <li><a href="#section-9" className={tocLnk}>§9 Sponsorship</a></li>
                <li><a href="#section-10" className={tocLnk}>§10 Termination</a></li>
                <li><a href="#section-11" className={tocLnk}>§11 Limitation of liability</a></li>
                <li><a href="#section-12" className={tocLnk}>§12 Changes to terms</a></li>
                <li><a href="#section-13" className={tocLnk}>§13 Governing law</a></li>
                <li><a href="#section-14" className={tocLnk}>§14 Contact</a></li>
              </ol>
            </nav>

            {/* §1 Acceptance of terms */}
            <section id="section-1" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Acceptance of terms
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                By using Deadmeter, you agree to these Terms of Service. If you do not agree, do
                not use the service.
              </p>
            </section>

            <Divider />

            {/* §2 Service description */}
            <section id="section-2" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Service description
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                Deadmeter provides:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Pulse weekly publication (free forever)
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Death Certificate per-document analysis
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Tools (eight tools as documented at{' '}
                  <Link href="/tools" className={lnk}>
                    /tools
                  </Link>
                  )
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  API access (Pro and Scale tiers)
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Service is provided as-is. We make no guarantees about uptime, accuracy, or
                fitness for any specific purpose beyond what is documented.
              </p>
            </section>

            <Divider />

            {/* §3 Account responsibilities */}
            <section id="section-3" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Account responsibilities
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                You are responsible for:
              </p>
              <ul className="list-disc pl-7 mb-6 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Maintaining account security
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Accurate account information
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Lawful use of the service
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Not sharing credentials
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                You may not:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Use the service for illegal purposes
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Attempt to bypass rate limits or quota systems
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Reverse-engineer the methodology to game results
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Submit content that violates applicable law
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Submit copyrighted content without rights to use it
                </li>
              </ul>
            </section>

            <Divider />

            {/* §4 Pricing and payments */}
            <section id="section-4" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Pricing and payments
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                Pricing is documented at{' '}
                <Link href="/pricing" className={lnk}>
                  /pricing
                </Link>
                . Subscriptions auto-renew until canceled. Cancel anytime. Refund policy:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Monthly:</strong>{' '}
                  cancel anytime, no refund for current period
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Annual:</strong>{' '}
                  prorated refund for unused months
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">Lifetime:</strong>{' '}
                  14-day money-back, then non-refundable
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  <strong className="text-[var(--text-primary)] font-semibold">
                    Pay-as-you-go credits:
                  </strong>{' '}
                  14-day money-back on unused credits only
                </li>
              </ul>
            </section>

            <Divider />

            {/* §5 Free tier commitment */}
            <section id="section-5" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Free tier commitment
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                Pulse content (current and archive), Pulse RSS feed, and Pulse email subscription
                will remain free indefinitely. We commit to not removing free Pulse access.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Free tier of Cert and Tools (current quotas: 3 Cert per day anonymous plus 30 per
                month with account; 5 Tools per day anonymous plus 50 per month with account) may
                be modified with at least 180 days advance notice.
              </p>
            </section>

            <Divider />

            {/* §6 Tool limitations and disclaimers */}
            <section id="section-6" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Tool limitations and disclaimers
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                Each tool ships with documented limitations. Read the per-tool disclaimer before
                relying on results.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                Tool results are diagnostic signals, not legal evidence, not verdicts on
                authorship, not measures of truth. Use as one signal among many in your
                investigation.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                We do not guarantee any specific accuracy. Documented accuracy ranges are subject
                to change as methodology evolves and as Phase 0 validation completes.
              </p>
            </section>

            <Divider />

            {/* §7 Cert content rights */}
            <section id="section-7" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Cert content rights
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                You retain rights to text you submit. We retain rights to derived metadata (Cert
                score, hash, signature).
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                You grant us a non-exclusive license to:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Process your submitted text through tool pipelines
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Store text for 30 days for permalink rendering
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Display Cert metadata at the permanent URL indefinitely
                </li>
              </ul>
            </section>

            <Divider />

            {/* §8 Apolitical scope */}
            <section id="section-8" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Apolitical scope
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                The service is apolitical by design. Submission of political content may be
                rejected by tool filters. Discussion of methodology is not subject to apolitical
                filtering, but tool inputs are.
              </p>
            </section>

            <Divider />

            {/* §9 Sponsorship */}
            <section id="section-9" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Sponsorship
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Sponsorship of Pulse publications is disclosed in each issue. Sponsors do not
                influence methodology, measurements, or coverage decisions. Sponsorship categories
                may be auto-rejected based on sponsor policies (political, AI labs in conflict of
                interest).
              </p>
            </section>

            <Divider />

            {/* §10 Termination */}
            <section id="section-10" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Termination
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                We may terminate accounts for:
              </p>
              <ul className="list-disc pl-7 mb-5 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Violation of these terms
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Fraudulent payment activity
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Abuse of the service or other users
                </li>
              </ul>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                You may terminate your account at any time. Data deletion within 30 days of
                termination request.
              </p>
            </section>

            <Divider />

            {/* §11 Limitation of liability */}
            <section id="section-11" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Limitation of liability
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-3">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-7 space-y-2">
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  We are not liable for any indirect, incidental, or consequential damages
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  Total liability is limited to the amount you paid in the 12 months preceding
                  the claim
                </li>
                <li className="text-[17px] text-[var(--text-secondary)] leading-[1.65]">
                  We are not liable for decisions you make based on tool results
                </li>
              </ul>
            </section>

            <Divider />

            {/* §12 Changes to terms */}
            <section id="section-12" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Changes to terms
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70] mb-4">
                We may update these terms. Material changes are announced through email to account
                holders, plus 30 days notice on the homepage.
              </p>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                Previous versions archived at deadmeter.com/terms/v1, etc.
              </p>
            </section>

            <Divider />

            {/* §13 Governing law */}
            <section id="section-13" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Governing law
              </h2>
              {/* NOTE: TZ_03 §11.2: "To be specified once jurisdiction established. Pavel handles." */}
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                To be specified once jurisdiction is established.
              </p>
            </section>

            <Divider />

            {/* §14 Contact */}
            <section id="section-14" className="mb-12">
              <h2 className="font-serif text-[24px] font-bold text-[var(--text-primary)] leading-[1.15] tracking-[-0.015em] mb-5">
                Contact
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.70]">
                For questions about these terms, email{' '}
                <a href="mailto:legal@deadmeter.com" className={lnk}>
                  legal@deadmeter.com
                </a>
                .
              </p>
            </section>

          </div>
        </article>

        {/* ── PAGE FOOTER (archive + version) ──────────────────────────── */}
        <div className="container-reading pb-[80px]">
          <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav aria-label="Legal pages" className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-[var(--border-warm)]" aria-hidden="true">·</span>
              <Link
                href="/cookies"
                className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                Cookie Policy
              </Link>
            </nav>
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
              Last updated: May 20, 2026
            </p>
          </div>
        </div>

      </main>
    </>
  );
}