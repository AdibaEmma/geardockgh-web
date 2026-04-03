import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductsPageContent } from '@/components/shop/ProductsPageContent';
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/JsonLd';
import { getCategoryContent, getAllCategorySlugs } from '@/lib/data/category-content';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getCategoryContent(slug);
  if (!content) return { title: 'Category Not Found' };

  return {
    title: `${content.h1} — GearDockGH`,
    description: content.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/products/category/${slug}`,
    },
    openGraph: {
      title: `${content.h1} — GearDockGH`,
      description: content.metaDescription,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getCategoryContent(slug);
  if (!content) notFound();

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Products', url: `${SITE_URL}/products` },
          { name: content.title, url: `${SITE_URL}/products/category/${slug}` },
        ]}
      />
      <FAQPageJsonLd questions={content.faqs} />

      <div className="mb-8">
        <h1
          className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          {content.h1}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          {content.intro}
        </p>
      </div>

      <ProductsPageContent initialCategory={slug} />

      {/* FAQ Section */}
      <div className="mt-16">
        <h2
          className="font-[family-name:var(--font-outfit)] text-xl font-bold"
          style={{ color: 'var(--white)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-4">
          {content.faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border p-5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <h3 className="text-sm font-semibold" style={{ color: 'var(--white)' }}>
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
