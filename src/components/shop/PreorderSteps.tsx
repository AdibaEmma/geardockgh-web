'use client';

import { MousePointerClick, CreditCard, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Choose Your Gear',
    description: 'Browse our pre-order catalog and pick the tech you want. Every item is verified and sourced from trusted suppliers.',
  },
  {
    icon: CreditCard,
    title: 'Pay a Small Deposit',
    description: 'Secure your order with a refundable deposit via MoMo or card. No full payment until your gear arrives.',
  },
  {
    icon: Truck,
    title: 'We Deliver to Your Door',
    description: 'We handle import, customs, and delivery. You get a tracking ETA and your gear arrives in Bolgatanga.',
  },
];

export function PreorderSteps() {
  return (
    <section className="mt-12">
      <h2
        className="mb-8 text-center font-[family-name:var(--font-outfit)] text-2xl font-bold sm:text-3xl"
        style={{ color: 'var(--white)' }}
      >
        How Pre-Orders Work
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="relative rounded-xl border p-6 text-center"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <span
                className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: 'var(--gold)', color: 'var(--black)' }}
              >
                <Icon size={22} />
              </span>

              <div
                className="absolute left-4 top-4 font-[family-name:var(--font-space-mono)] text-xs font-bold"
                style={{ color: 'var(--border)' }}
              >
                0{i + 1}
              </div>

              <h3
                className="mt-2 text-sm font-semibold"
                style={{ color: 'var(--white)' }}
              >
                {step.title}
              </h3>
              <p
                className="mt-2 text-xs leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
