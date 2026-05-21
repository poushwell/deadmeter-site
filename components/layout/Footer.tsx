import Link from 'next/link';

const columns = [
  {
    heading: 'Product',
    links: [
      { href: '/methodology', label: 'Methodology' },
      { href: '/tools',       label: 'Tools'       },
      { href: '/pricing',     label: 'Pricing'     },
      { href: '/faq',         label: 'FAQ'         },
    ],
  },
  {
    heading: 'Cert',
    links: [
      { href: '/cert', label: 'Death Certificate' },
    ],
  },
  {
    heading: 'Pulse',
    links: [
      { href: '/pulse', label: 'Latest issue' },
      { href: '/pulse', label: 'Pulse archive'      },
      { href: '/pulse', label: 'Subscribe'    },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms',   label: 'Terms'   },
      { href: '/cookies', label: 'Cookies' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--bg)] pt-16 pb-10">
      <div className="container">
        <div className="footer-grid grid grid-cols-2 gap-8 mb-14">
          {/* Brand */}
          <div className="footer-brand col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] block mb-3"
            >
              Deadmeter
            </Link>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] max-w-[280px]">
              Internet content tracking with calibrated confidence intervals.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2 list-none p-0 m-0">
                {col.links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[14px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-[var(--text-tertiary)]">
  METHODOLOGY V1.0 · ········ · 2026 PAVEL ISHCHIN
</p>
        </div>
      </div>
    </footer>
  );
}