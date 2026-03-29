import type { Product } from '@/types';
import { CATEGORIES } from '@/lib/utils/constants';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

function parseImages(product: Product): string[] {
  if (product.imagesJson) {
    try {
      return JSON.parse(product.imagesJson);
    } catch {
      /* fall through */
    }
  }
  return [];
}

function getCategoryLabel(slug: string | null): string | null {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GearDockGH',
    url: SITE_URL,
    logo: `${SITE_URL}/images/branding/geardockgh-logo-nobg.png`,
    description:
      "Ghana's premium tech gear store for remote workers, content creators, and gamers. Verified imports, priced in cedis, delivered in 48 hours.",
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
      process.env.NEXT_PUBLIC_SOCIAL_TIKTOK,
      process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
      process.env.NEXT_PUBLIC_SOCIAL_TWITTER,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const images = parseImages(product);
  const priceGhs = (product.pricePesewas / 100).toFixed(2);
  const category = getCategoryLabel(product.category);

  const availability =
    product.stockCount > 0
      ? 'https://schema.org/InStock'
      : product.isPreorder
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/OutOfStock';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: `${SITE_URL}/products/${product.slug}`,
    image: images,
    description: product.description ?? `${product.name} — available at GearDockGH, Ghana's premium tech gear store.`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'GearDockGH',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'GHS',
      price: priceGhs,
      availability,
      seller: {
        '@type': 'Organization',
        name: 'GearDockGH',
      },
    },
  };

  if (category) {
    schema.category = category;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
