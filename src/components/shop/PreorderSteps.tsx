'use client';

import { MousePointerClick, CreditCard, Package, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Choose Your Gear',
    description: 'Browse our pre-order catalog and pick the tech you want. Every item is verified and sourced from trusted suppliers.',
  },
  {
    icon: CreditCard,
    title: 'Make Payment',
    description: 'Pay via MoMo or card to secure your order. Once your gear arrives in Ghana, you pay the remaining balance plus shipping fee.',
  },
  {
    icon: Package,
    title: 'Shipping',
    description: 'We handle sourcing, import, and customs clearance. Shipping fee applies based on item size and location. You get WhatsApp updates at every stage with a tracking ETA.',
  },
  {
    icon: Truck,
    title: 'We Deliver',
    description: 'Your gear arrives at your door in Bolgatanga. Inspect it, and if anything is off, our 7-day return policy has you covered.',
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
