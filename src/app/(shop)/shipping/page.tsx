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
    cost: 'From GH\u20B5 40',
  },
  {
    name: 'Accra & Greater Accra',
    timeline: '3-5 business days',
    cost: 'From GH\u20B5 45',
  },
  {
    name: 'Other Regions',
    timeline: '4-7 business days',
    cost: 'From GH\u20B5 50',
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
      <h1 className="text-3xl font-bold text-text-primary">
        Shipping & Delivery
      </h1>
      <p className="mt-2 text-text-secondary">
        We deliver across Ghana. Here are our shipping zones, timelines, and
        costs.
      </p>

      <div className="mt-10 space-y-4">
        {zones.map((zone) => (
          <div
            key={zone.name}
            className="flex flex-col gap-1 rounded-xl border border-border-default bg-bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-semibold text-text-primary">{zone.name}</h2>
              <p className="text-sm text-text-muted">{zone.timeline}</p>
            </div>
            <span className="text-sm font-medium text-accent-primary">
              {zone.cost}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border-default bg-bg-secondary/50 p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          How It Works
        </h2>
        <ol className="mt-4 space-y-3 text-sm text-text-secondary">
          <li>
            <span className="font-medium text-text-primary">1. Order</span> —
            Place your order and pay via MoMo, card, or bank transfer.
          </li>
          <li>
            <span className="font-medium text-text-primary">2. Confirm</span> —
            We verify your payment and prepare your package.
          </li>
          <li>
            <span className="font-medium text-text-primary">3. Ship</span> — Your
            order is dispatched via our trusted courier partners.
          </li>
          <li>
            <span className="font-medium text-text-primary">4. Deliver</span> —
            Receive your gear at your doorstep. We&apos;ll keep you updated via
            WhatsApp.
          </li>
        </ol>
      </div>
    </div>
  );
}
