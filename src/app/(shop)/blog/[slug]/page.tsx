import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogSlugs } from '@/lib/data/blog-posts';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl py-8">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`${SITE_URL}/blog/${post.slug}`}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-secondary"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <div className="mt-6">
        <span className="text-xs font-medium text-accent-primary">
          {post.category}
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
          <span>{post.publishedAt}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>

      <div
        className="prose-geardock mt-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
