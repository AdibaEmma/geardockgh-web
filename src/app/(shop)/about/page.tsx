import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export const metadata: Metadata = {
  title: 'About GearDockGH — Premium Tech Gear for Ghana',
  description:
    'GearDockGH delivers verified imported tech gear to Ghana — laptops, headphones, gaming gear, and more. Priced in cedis, delivered in 48 hours.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-bold text-text-primary">About GearDockGH</h1>
      <p className="mt-4 text-text-secondary">
        Coming soon — learn about who we are, how we source, and why we built
        Ghana&apos;s most trusted tech gear store.
      </p>
    </div>
  );
}
