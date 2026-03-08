import type { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 text-sm transition-colors hover:opacity-80"
        style={{ color: 'var(--muted)' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back
      </Link>
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="mb-8 text-center">
          <h1
            className="font-[family-name:var(--font-syne)] text-2xl font-bold"
            style={{ color: 'var(--gold)' }}
          >
            GearDockGH
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
