import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register — GearDockGH',
};

export default function RegisterPage() {
  return (
    <div>
      <h2
        className="mb-2 text-center font-[family-name:var(--font-syne)] text-xl font-semibold"
        style={{ color: 'var(--white)' }}
      >
        Create your account
      </h2>
      <p
        className="mb-6 text-center text-sm"
        style={{ color: 'var(--muted)' }}
      >
        Join GearDockGH to access premium gear
      </p>
      <RegisterForm />
    </div>
  );
}
