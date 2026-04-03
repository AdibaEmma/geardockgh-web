import type { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/data/blog-posts';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/api';

const CATEGORIES = [
  'phones-tablets',
  'audio',
  'computing',
  'gaming',
  'power-energy',
  'home-office',
  'cameras-video',
  'storage-networking',
  'tv-streaming',
  'accessories',
];

interface ProductEntry {
  slug: string;
  updatedAt: string;
}

async function fetchAllProductSlugs(): Promise<ProductEntry[]> {
  try {
    const res = await fetch(`${API_URL}/products?limit=500&page=1`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const products = json.data ?? [];
    return products.map((p: { slug: string; updatedAt: string }) => ({
      slug: p.slug,
      updatedAt: p.updatedAt,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/guides/remote-work-setup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/products/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
