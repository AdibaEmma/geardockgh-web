import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

const zones = [
  {
    name: 'Bolgatanga & Upper East',
    timeline: '24-48 hours',
    cost: 'Free on orders over GH\u20B5 500',
  },
  {
    name: 'Tamale & Northern Region',
    timeline: '2-3 business days',
    cost: 'From GH\u20B5 30',
  },
  {
    name: 'Kumasi & Ashanti Region',
    timeline: '3-4 business days',
    cost: 'From GH\u20B5 50',
  },
  {
    name: 'Accra & Greater Accra',
    timeline: '3-5 business days',
    cost: 'From GH\u20B5 60',
  },
  {
    name: 'Other Regions',
    timeline: '4-7 business days',
    cost: 'From GH\u20B5 60',
  },
];

export const metadata: Metadata = {
  title: 'Shipping & Delivery — GearDockGH',
  description:
    'GearDockGH delivers tech gear across Ghana. 24-48 hour delivery in Bolgatanga, 3-5 days nationwide. Free shipping on qualifying orders.',
  alternates: {
    canonical: `${SITE_URL}/shipping`,
  },
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Shipping &amp; Delivery
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        We deliver across Ghana. Here are our shipping zones, timelines, and
        costs.
      </p>

      <div className="mt-10 space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.name}
            className="flex flex-col gap-1 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--white)' }}>{zone.name}</h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{zone.timeline}</p>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
              {zone.cost}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-10 rounded-xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2
          className="font-[family-name:var(--font-outfit)] text-lg font-semibold"
          style={{ color: 'var(--white)' }}
        >
          How It Works
        </h2>
        <ol className="mt-4 space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
          <li>
            <span className="font-medium" style={{ color: 'var(--white)' }}>1. Order</span> —
            Place your order and pay via MoMo, card, or bank transfer.
          </li>
          <li>
            <span className="font-medium" style={{ color: 'var(--white)' }}>2. Confirm</span> —
            We verify your payment and prepare your package.
          </li>
          <li>
            <span className="font-medium" style={{ color: 'var(--white)' }}>3. Ship</span> — Your
            order is dispatched via our trusted courier partners.
          </li>
          <li>
            <span className="font-medium" style={{ color: 'var(--white)' }}>4. Deliver</span> —
            Receive your gear at your doorstep. We&apos;ll keep you updated via
            WhatsApp.
          </li>
        </ol>
      </div>
    </div>
  );
}
