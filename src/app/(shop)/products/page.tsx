import type { Metadata } from 'next';
import { ProductsPageContent } from '@/components/shop/ProductsPageContent';

export const metadata: Metadata = {
  title: 'Shop Premium Tech Gear in Ghana',
  description:
    'Browse 88+ verified imported products — laptops, headphones, monitors, keyboards, and more. Priced in cedis, MoMo accepted, 48h delivery in Bolgatanga.',
  openGraph: {
    title: 'Shop Premium Tech Gear in Ghana',
    description:
      'Browse 88+ verified imported products — laptops, headphones, monitors, keyboards, and more. Priced in cedis, MoMo accepted, 48h delivery.',
    type: 'website',
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com'}/products`,
  },
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
