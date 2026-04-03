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
  {
    slug: 'gaming-setup-under-5000-cedis-ghana',
    title: 'Gaming Setup Under GH₵ 5,000 in Ghana',
    excerpt:
      'You do not need to spend a fortune to get a solid gaming setup in Ghana. Here is how to build one under GH₵ 5,000 — all from GearDockGH.',
    content: `
      <p>Gaming in Ghana is growing, but most people think you need GH₵ 10,000+ to get started. That is not true. With smart choices, you can put together a solid gaming setup for under GH₵ 5,000 — and every item is available right here at GearDockGH.</p>

      <h2>The Budget Breakdown</h2>
      <p>Here is how we would allocate GH₵ 5,000 for a complete gaming setup:</p>
      <ul>
        <li><strong>Gaming headset (GH₵ 400-800)</strong> — a good headset is non-negotiable. You need clear audio for game sound and a decent mic for team chat</li>
        <li><strong>Controller (GH₵ 300-600)</strong> — whether you game on PC or console, a quality controller makes a difference</li>
        <li><strong>Gaming mouse and pad (GH₵ 200-500)</strong> — for PC gamers, a responsive mouse is essential</li>
        <li><strong>Power protection (GH₵ 400-800)</strong> — a UPS or surge protector saves your gear during dumsor</li>
        <li><strong>Accessories (GH₵ 200-400)</strong> — cables, USB hubs, and desk accessories to complete the setup</li>
      </ul>
      <p>That leaves GH₵ 1,500-3,000 for your main platform — whether that is saving for a console or upgrading your existing PC.</p>

      <h2>Tips for Getting the Most Value</h2>
      <ul>
        <li>Start with what matters most to your gaming style — FPS players need a good mouse, narrative gamers need a good headset</li>
        <li>Always buy a surge protector before anything else — one dumsor spike can destroy GH₵ 3,000 worth of equipment</li>
        <li>Check our pre-order page for upcoming deals on bundles</li>
      </ul>

      <h2>Browse Our Gaming Section</h2>
      <p>All gaming gear at GearDockGH is verified, priced in cedis, and available for fast delivery across Ghana. No fakes, no 6-week waits.</p>
    `,
    category: 'Buying Guides',
    publishedAt: '2026-04-02',
    readingTime: '5 min read',
  },
  {
    slug: 'momo-vs-card-paying-for-tech-online-ghana',
    title: 'MoMo vs Card: Best Way to Pay for Tech Gear Online in Ghana',
    excerpt:
      'Should you pay with MoMo or card when buying tech gear online in Ghana? Here are the pros and cons of each payment method.',
    content: `
      <p>When shopping for tech gear online in Ghana, you have two main options: mobile money (MoMo, Vodafone Cash, AirtelTigo) or card payments (Visa, Mastercard). Both work at GearDockGH, but which is better for you?</p>

      <h2>Mobile Money (MoMo)</h2>
      <p><strong>Pros:</strong></p>
      <ul>
        <li>No bank account needed — if you have a phone, you have MoMo</li>
        <li>Instant confirmation — payment clears immediately</li>
        <li>Widely trusted — most Ghanaians use MoMo daily</li>
        <li>No card details to worry about — just approve on your phone</li>
      </ul>
      <p><strong>Cons:</strong></p>
      <ul>
        <li>Transaction limits — some networks cap daily spending at GH₵ 10,000</li>
        <li>E-levy applies — though the rate is low, it adds up on big purchases</li>
      </ul>

      <h2>Card Payments (Visa/Mastercard)</h2>
      <p><strong>Pros:</strong></p>
      <ul>
        <li>Higher transaction limits — better for expensive items like laptops</li>
        <li>Some banks offer purchase protection or rewards points</li>
        <li>Familiar for those who shop internationally</li>
      </ul>
      <p><strong>Cons:</strong></p>
      <ul>
        <li>Requires a bank account with a debit or credit card</li>
        <li>Some Ghana-issued cards have online transaction blocks you need to enable</li>
      </ul>

      <h2>Our Recommendation</h2>
      <p>For purchases under GH₵ 5,000, MoMo is the fastest and easiest option. For larger purchases like laptops or monitors, card payment avoids MoMo transaction limits. Either way, GearDockGH supports both — pay however works best for you.</p>
    `,
    category: 'Ghana Tech Tips',
    publishedAt: '2026-04-03',
    readingTime: '4 min read',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
