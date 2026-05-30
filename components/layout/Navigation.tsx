'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/methodology', label: 'Methodology' },
  { href: '/tools',       label: 'Tools'       },
  { href: '/pricing',     label: 'Pricing'     },
  { href: '/faq',         label: 'FAQ'         },
];

interface NavigationProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

export function Navigation({ mobile = false, onLinkClick }: NavigationProps) {
  const pathname = usePathname();

  function handleClick(href: string) {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onLinkClick) onLinkClick();
  }

  if (mobile) {
    return (
      <ul className="flex flex-col list-none p-0 m-0">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => handleClick(href)}
                className={`block py-3 text-[15px] font-medium border-b border-[var(--border)] transition-colors ${
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => handleClick(href)}
            className={`text-[15px] font-medium transition-colors ${
              isActive
                ? 'text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-0.5'
                : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}