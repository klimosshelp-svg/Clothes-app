import Link from 'next/link';
import clsx from 'clsx';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={clsx(
        'select-none text-lg font-semibold tracking-brand text-ink',
        className
      )}
      aria-label="Arwin home"
    >
      ARWIN
    </Link>
  );
}
