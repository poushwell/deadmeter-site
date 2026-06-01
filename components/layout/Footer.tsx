'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// TZ_02 §2.2: three columns exactly — Product | Pulse | Legal
// No Cert column — Death Certificate is accessible via /tools
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
    heading: 'Pulse',
    links: [
      { href: '/pulse',            label: 'Pulse'         },
      { href: '/pulse',            label: 'Pulse archive' },
      { href: '/pulse#subscribe',  label: 'Subscribe'     },
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
  const pathname = usePathname();

  function handleClick(href: string) {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <footer className="bg-[var(--bg)] pt-16 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-14">

          {/* Logo + tagline */}
          <div className="col-span-1">
            <Link
              href="/"
              onClick={() => handleClick('/')}
              className="font-serif text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] block mb-3"
            >
              Deadmeter
            </Link>
            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] max-w-[280px]">
              Internet content tracking with calibrated confidence intervals.
            </p>
          </div>

          {/* Link columns — TZ_02 §2.2 */}
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
                      onClick={() => handleClick(href)}
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

        {/* Bottom row — TZ_03 verbatim: mixed case, real hash */}
        <div className="border-t border-[var(--border)] pt-8">
          <p className="font-mono text-[11px] tracking-[0.05em] text-[var(--text-tertiary)]">
            Methodology v1.0 · 4F7A2C91 · 2026 Pavel Ishchin
          </p>
        </div>
      </div>
    </footer>
  );
}