import type { Metadata } from 'next';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { fetchProductBySlug } from '@/lib/api/server';
import { ProductJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { CATEGORIES } from '@/lib/utils/constants';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

function parseImages(imagesJson: string | null): string[] {
  if (imagesJson) {
    try {
      return JSON.parse(imagesJson);
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

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    };
  }

  const images = parseImages(product.imagesJson);
  const firstImage = images[0] ?? undefined;
  const priceGhs = (product.pricePesewas / 100).toFixed(2);
  const category = getCategoryLabel(product.category);

  const description = product.description
    ? product.description.length > 155
      ? product.description.slice(0, 155) + '...'
      : product.description
    : `Buy ${product.name} in Ghana for GH₵${priceGhs}. Verified import, MoMo accepted, 48h delivery.`;

  const title = `${product.name}${category ? ` — ${category}` : ''}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      type: 'website',
      images: firstImage ? [{ url: firstImage, alt: product.name }] : undefined,
      siteName: 'GearDockGH',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: firstImage ? [firstImage] : undefined,
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Products', url: `${SITE_URL}/products` },
  ];

  if (product) {
    const category = getCategoryLabel(product.category);
    if (category && product.category) {
      breadcrumbs.push({
        name: category,
        url: `${SITE_URL}/products?category=${product.category}`,
      });
    }
    breadcrumbs.push({
      name: product.name,
      url: `${SITE_URL}/products/${product.slug}`,
    });
  }

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {product && <ProductJsonLd product={product} />}
      <ProductDetail slug={slug} />
    </>
  );
}
