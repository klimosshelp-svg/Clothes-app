import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-arwin flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <Logo />
          <p className="text-sm text-ink/50">
            AI virtual try-on for fashion brands.
          </p>
        </div>
        <p className="text-xs text-ink/40">
          © {new Date().getFullYear()} Arwin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
