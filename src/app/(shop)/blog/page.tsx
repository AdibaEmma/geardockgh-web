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
      <h1
        className="font-[family-name:var(--font-outfit)] text-3xl font-bold"
        style={{ color: 'var(--white)' }}
      >
        Blog
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Buying guides, tech tips, and product insights for Ghana&apos;s digital
        professionals.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border p-6 transition-all hover:border-[var(--gold)]/40 hover:shadow-lg"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>
              {post.category}
            </span>
            <h2
              className="mt-2 text-lg font-semibold transition-colors group-hover:text-[var(--gold)]"
              style={{ color: 'var(--white)' }}
            >
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
              <span>{post.publishedAt}</span>
              <span>{post.readingTime}</span>
            </div>
            <span
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: 'var(--gold)' }}
            >
              Read more <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
