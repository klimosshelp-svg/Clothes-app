'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Logo } from './Logo';
import { AuthButton } from './AuthButton';

const LINKS = [
  { href: '/upload', label: 'Upload' },
  { href: '/generate', label: 'Generate' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/settings', label: 'Settings' },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-md">
      <nav className="container-arwin flex h-16 items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'rounded-full px-4 py-2 text-sm transition-colors',
                pathname?.startsWith(l.href)
                  ? 'bg-paper-muted text-ink'
                  : 'text-ink/60 hover:text-ink'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <Link href="/upload" className="btn-primary hidden md:inline-flex">
            Start creating
          </Link>
          <Link href="/upload" className="btn-primary md:hidden">
            Start
          </Link>
        </div>
      </nav>
    </header>
  );
}
