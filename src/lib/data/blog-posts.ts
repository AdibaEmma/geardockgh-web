export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  readingTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-headphones-remote-work-ghana-2026',
    title: 'Best Headphones for Remote Workers in Ghana (2026)',
    excerpt:
      'Working remotely from Accra, Kumasi, or Bolgatanga? Here are the best noise-cancelling and wireless headphones available in Ghana — priced in cedis, delivered to your door.',
    content: `
      <p>Remote work in Ghana is growing fast, and having the right audio gear can make or break your productivity. Whether you're on Zoom calls all day or need focus music to block out generator noise during dumsor, the right headphones matter.</p>

      <h2>What to Look For</h2>
      <p>When choosing headphones for remote work in Ghana, consider:</p>
      <ul>
        <li><strong>Active Noise Cancellation (ANC)</strong> — essential for blocking out background noise, especially generators and street sounds</li>
        <li><strong>Microphone quality</strong> — your clients and colleagues need to hear you clearly on calls</li>
        <li><strong>Battery life</strong> — important during power outages when you're running on laptop battery</li>
        <li><strong>Comfort</strong> — if you're wearing them 8+ hours, weight and cushioning matter</li>
      </ul>

      <h2>Our Top Picks</h2>
      <p>Check out our curated selection of remote work headphones, all verified imports with warranty, priced in cedis and available for delivery across Ghana.</p>

      <h2>Why Buy from GearDockGH?</h2>
      <p>Every product we sell is sourced directly from authorized distributors. No fakes, no 6-week waits from Amazon. Order today, receive within 48 hours in Bolgatanga or 3-5 days nationwide. Pay with MoMo.</p>
    `,
    category: 'Buying Guides',
    publishedAt: '2026-04-01',
    readingTime: '4 min read',
  },
  {
    slug: 'protect-laptop-dumsor-ghana',
    title: 'How to Protect Your Laptop During Dumsor in Ghana',
    excerpt:
      'Power outages can damage your equipment. Here\'s how to protect your laptop, monitor, and other tech gear during Ghana\'s load shedding periods.',
    content: `
      <p>Dumsor (load shedding) is a reality for many Ghanaians, and sudden power cuts can damage your tech equipment over time. Voltage spikes when power returns are the biggest threat to your laptop, monitor, and other electronics.</p>

      <h2>The Real Risk</h2>
      <p>When power cuts and returns suddenly, the voltage spike can fry your laptop's power supply, damage your monitor, or corrupt data on external drives. Over time, even small fluctuations reduce the lifespan of your electronics.</p>

      <h2>Essential Protection Gear</h2>
      <ul>
        <li><strong>UPS (Uninterruptible Power Supply)</strong> — gives you 15-30 minutes to save work and shut down properly</li>
        <li><strong>Surge Protector</strong> — blocks voltage spikes from reaching your equipment</li>
        <li><strong>Power Bank / Portable Power Station</strong> — keeps you working during extended outages</li>
      </ul>

      <h2>Our Recommendations</h2>
      <p>Browse our Power & Energy category for UPS units, surge protectors, and portable power stations — all available with fast delivery across Ghana.</p>
    `,
    category: 'Ghana Tech Tips',
    publishedAt: '2026-03-28',
    readingTime: '3 min read',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
