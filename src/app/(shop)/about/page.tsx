import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, MessageCircle } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export const metadata: Metadata = {
  title: 'About GearDockGH — Premium Tech Gear for Ghana',
  description:
    'GearDockGH delivers verified imported tech gear to Ghana — laptops, headphones, gaming gear, and more. Priced in cedis, delivered in 48 hours.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Verified Imports Only',
    description:
      'Every product is sourced from authorized distributors. No fakes, no refurbished items sold as new, no grey market risk.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery Nationwide',
    description:
      'Get your gear within 24-48 hours in Bolgatanga and 3-5 business days to Accra, Kumasi, Tamale, and everywhere in between.',
  },
  {
    icon: CreditCard,
    title: 'Pay Your Way',
    description:
      'MTN MoMo, Vodafone Cash, AirtelTigo Money, Visa, Mastercard — pay however works best for you. All prices in cedis.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp-First Support',
    description:
      'Got a question? Tap the WhatsApp button on any page. We respond fast because we know you need answers before you buy.',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        About GearDockGH
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        <p>
          GearDockGH started with a simple frustration: buying quality tech gear in Ghana meant
          either paying double on Jumia, waiting 6 weeks for Amazon to ship, or risking fakes
          from unverified sellers. There had to be a better way.
        </p>
        <p>
          We built GearDockGH to solve that. We source premium laptops, headphones, gaming gear,
          power solutions, and accessories directly from authorized distributors. We verify every
          product, price everything in Ghanaian cedis, and deliver to your door — fast.
        </p>
        <p>
          Based in Bolgatanga with delivery across Ghana, we serve remote workers, content creators,
          gamers, and students who need gear they can trust without the hassle of international
          ordering.
        </p>
      </div>

      <h2
        className="mt-12 font-[family-name:var(--font-outfit)] text-xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        What We Stand For
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <div
            key={value.title}
            className="rounded-xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <value.icon size={22} style={{ color: 'var(--gold)' }} />
            <h3
              className="mt-3 text-sm font-semibold"
              style={{ color: 'var(--white)' }}
            >
              {value.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              {value.description}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-12 rounded-xl border p-6 text-center"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2
          className="font-[family-name:var(--font-outfit)] text-lg font-bold"
          style={{ color: 'var(--white)' }}
        >
          Ready to upgrade your setup?
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
          Browse our collection of verified tech gear — priced in cedis, delivered fast.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{
            background: 'var(--gold)',
            color: 'var(--deep)',
          }}
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
