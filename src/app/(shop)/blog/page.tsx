import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/data/blog-posts';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://geardockgh.com';

export const metadata: Metadata = {
  title: 'Blog — GearDockGH',
  description:
    'Tech buying guides, product comparisons, and tips for remote workers, content creators, and gamers in Ghana.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold text-text-primary">Blog</h1>
      <p className="mt-2 text-text-secondary">
        Buying guides, tech tips, and product insights for Ghana&apos;s digital
        professionals.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border-default bg-bg-secondary/50 p-6 transition-all hover:border-accent-primary/30 hover:shadow-lg hover:shadow-accent-primary/5"
          >
            <span className="text-xs font-medium text-accent-primary">
              {post.category}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
              <span>{post.publishedAt}</span>
              <span>{post.readingTime}</span>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-primary opacity-0 transition-opacity group-hover:opacity-100">
              Read more <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
