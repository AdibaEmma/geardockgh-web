import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login — GearDockGH',
};

export default function LoginPage() {
  return (
    <div>
      <h2
        className="mb-2 text-center font-[family-name:var(--font-syne)] text-xl font-semibold"
        style={{ color: 'var(--white)' }}
      >
        Welcome back
      </h2>
      <p
        className="mb-6 text-center text-sm"
        style={{ color: 'var(--muted)' }}
      >
        Sign in to your GearDockGH account
      </p>
      <LoginForm />
    </div>
  );
}
