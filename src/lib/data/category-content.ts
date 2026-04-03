export interface CategoryContent {
  slug: string;
  title: string;
  h1: string;
  description: string;
  metaDescription: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

export const categoryContent: CategoryContent[] = [
  {
    slug: 'phones-tablets',
    title: 'Phones & Tablets',
    h1: 'Buy Phones & Tablets in Ghana',
    description: 'Shop smartphones, tablets, and mobile accessories in Ghana. Verified imports, priced in cedis, delivered to your door.',
    metaDescription:
      'Buy genuine smartphones and tablets in Ghana. Verified imports from top brands, priced in Ghanaian cedis with MoMo payment and fast delivery.',
    intro:
      'Find the latest smartphones and tablets at GearDockGH. Every device is a verified import — no fakes, no refurbished units sold as new. Whether you need a flagship phone for content creation or a budget tablet for work, we have it in stock and ready for delivery across Ghana. Pay with MoMo, Vodafone Cash, or card.',
    faqs: [
      { question: 'Are phones from GearDockGH genuine?', answer: 'Yes — every phone and tablet we sell is sourced from authorized distributors. We verify each device before listing and include manufacturer warranty.' },
      { question: 'Can I pay for a phone with MoMo?', answer: 'Absolutely. We accept MTN MoMo, Vodafone Cash, AirtelTigo Money, Visa, and Mastercard for all purchases.' },
      { question: 'How long does phone delivery take?', answer: 'We deliver within 24-48 hours in Bolgatanga and 3-5 business days to Accra, Kumasi, and other cities across Ghana.' },
    ],
  },
  {
    slug: 'audio',
    title: 'Audio',
    h1: 'Buy Headphones, Speakers & Microphones in Ghana',
    description: 'Premium audio gear in Ghana — headphones, speakers, and microphones for remote workers, creators, and gamers.',
    metaDescription:
      'Shop premium headphones, wireless speakers, and studio microphones in Ghana. Noise-cancelling, MoMo accepted, 48h delivery in Bolgatanga.',
    intro:
      'Your audio gear makes or breaks your remote work calls, content creation, and gaming sessions. GearDockGH stocks noise-cancelling headphones, wireless speakers, and studio microphones from top brands — all verified imports priced in cedis. Perfect for blocking out generator noise during dumsor or recording crystal-clear audio for your YouTube channel.',
    faqs: [
      { question: 'Which headphones are best for remote work in Ghana?', answer: 'We recommend headphones with active noise cancellation (ANC) to block background noise like generators. Check our buying guide for detailed recommendations.' },
      { question: 'Do you sell microphones for podcasting?', answer: 'Yes — we stock USB and XLR microphones suitable for podcasting, streaming, and content creation. All available for delivery across Ghana.' },
      { question: 'Can I return headphones if they do not fit?', answer: 'We offer a 7-day return window for products in original packaging. See our returns policy for full details.' },
    ],
  },
  {
    slug: 'computing',
    title: 'Computing',
    h1: 'Buy Laptops, Monitors & Keyboards in Ghana',
    description: 'Laptops, monitors, keyboards, and mice for professionals in Ghana. Verified imports with warranty.',
    metaDescription:
      'Buy laptops, external monitors, mechanical keyboards, and ergonomic mice in Ghana. Premium verified imports, MoMo accepted, nationwide delivery.',
    intro:
      'Whether you are a developer, designer, or remote worker, the right computing setup matters. GearDockGH brings you laptops, external monitors, mechanical keyboards, and ergonomic mice — all verified imports with manufacturer warranty. Set up your dream workstation without the hassle of ordering from Amazon and waiting 6 weeks.',
    faqs: [
      { question: 'Do laptops come with warranty in Ghana?', answer: 'Yes — all laptops include the manufacturer warranty. We also provide direct support if you encounter any issues.' },
      { question: 'Can I get a monitor delivered to Accra?', answer: 'Yes, we deliver monitors safely packaged to Accra and all other cities across Ghana within 3-5 business days.' },
      { question: 'What keyboards do you recommend for programming?', answer: 'We stock mechanical keyboards with various switch types ideal for programming. Browse our computing section to find the right fit.' },
    ],
  },
  {
    slug: 'gaming',
    title: 'Gaming',
    h1: 'Buy Gaming Gear in Ghana',
    description: 'Gaming consoles, controllers, headsets, and accessories in Ghana. Level up your setup.',
    metaDescription:
      'Shop gaming consoles, controllers, headsets, and peripherals in Ghana. Verified imports, priced in cedis, delivered fast.',
    intro:
      'Level up your gaming setup with gear from GearDockGH. We stock consoles, controllers, gaming headsets, and peripherals — all verified imports at Ghana prices. No more paying double on Amazon or risking fakes from unverified sellers. Order today and start gaming tomorrow.',
    faqs: [
      { question: 'Do you sell PlayStation and Xbox consoles?', answer: 'Yes — we stock current-generation consoles and accessories. Check our gaming section for available models and pricing in cedis.' },
      { question: 'Are gaming headsets compatible with both PC and console?', answer: 'Most headsets we sell are multi-platform compatible. Product descriptions list supported platforms for each item.' },
      { question: 'Can I pre-order upcoming gaming gear?', answer: 'Yes — visit our pre-order page to reserve items that are coming soon. Pay a deposit and we notify you when it arrives.' },
    ],
  },
  {
    slug: 'power-energy',
    title: 'Power & Energy',
    h1: 'Buy UPS, Power Banks & Generators in Ghana',
    description: 'Power banks, UPS systems, surge protectors, and portable power stations for dumsor-proofing your setup in Ghana.',
    metaDescription:
      'Dumsor-proof your setup. Buy UPS, power banks, surge protectors, and portable power stations in Ghana. MoMo accepted, fast delivery.',
    intro:
      'Dumsor does not have to mean downtime. GearDockGH stocks UPS systems, portable power stations, power banks, and surge protectors to keep your equipment running and protected during load shedding. Every product is tested and verified — because your laptop, monitor, and work cannot afford a voltage spike.',
    faqs: [
      { question: 'Which UPS is best for protecting my laptop during dumsor?', answer: 'For laptops, a UPS with 600-1000VA capacity gives you 15-30 minutes to save work and shut down safely. We stock multiple options.' },
      { question: 'Do you have solar-compatible power stations?', answer: 'Yes — some of our portable power stations support solar panel charging. Check individual product specs for compatibility.' },
      { question: 'How do surge protectors help during dumsor?', answer: 'Surge protectors block voltage spikes that occur when power is restored after a cut. They prevent damage to your electronics and extend their lifespan.' },
    ],
  },
  {
    slug: 'home-office',
    title: 'Home & Office',
    h1: 'Buy Desks, Chairs & Office Gear in Ghana',
    description: 'Desks, ergonomic chairs, lighting, and fans for your home office in Ghana.',
    metaDescription:
      'Set up your home office in Ghana. Buy desks, ergonomic chairs, desk lamps, and cooling fans. Priced in cedis, delivered to your door.',
    intro:
      'Your body pays the price of a bad setup. GearDockGH brings you ergonomic desks, chairs, LED desk lamps, and cooling fans to build a comfortable home office in Ghana. Whether you are working from Accra or Bolgatanga, the right furniture and accessories make a real difference in your productivity and health.',
    faqs: [
      { question: 'Do you deliver desks and furniture across Ghana?', answer: 'Yes — we deliver furniture items safely packaged nationwide. Delivery times vary by location and item size.' },
      { question: 'What desk lamp is best for long work hours?', answer: 'We recommend LED desk lamps with adjustable brightness and color temperature to reduce eye strain during long work sessions.' },
      { question: 'Do you sell standing desks?', answer: 'Check our home and office section for available desk options including adjustable-height models when in stock.' },
    ],
  },
  {
    slug: 'cameras-video',
    title: 'Cameras & Video',
    h1: 'Buy Cameras & Video Gear in Ghana',
    description: 'Webcams, ring lights, capture cards, and video equipment for creators in Ghana.',
    metaDescription:
      'Buy webcams, ring lights, capture cards, and video gear in Ghana. Perfect for content creators, streamers, and video calls.',
    intro:
      'Create professional content from Ghana. GearDockGH stocks webcams, ring lights, capture cards, and video accessories for YouTubers, streamers, and remote professionals. Look sharp on video calls and produce high-quality content without flying abroad to buy your gear.',
    faqs: [
      { question: 'Which webcam is best for video calls?', answer: 'For professional video calls, we recommend 1080p or 4K webcams with built-in microphones. Browse our cameras section for options.' },
      { question: 'Do you sell ring lights for content creation?', answer: 'Yes — we stock ring lights in various sizes suitable for YouTube, TikTok, and product photography.' },
      { question: 'Can I use a capture card for streaming?', answer: 'Yes — our capture cards work with OBS, Streamlabs, and other streaming software for console and camera capture.' },
    ],
  },
  {
    slug: 'storage-networking',
    title: 'Storage & Networking',
    h1: 'Buy SSDs, Hard Drives & Routers in Ghana',
    description: 'External SSDs, hard drives, USB hubs, and networking equipment in Ghana.',
    metaDescription:
      'Buy external SSDs, portable hard drives, USB hubs, and Wi-Fi routers in Ghana. Fast storage and reliable networking, delivered fast.',
    intro:
      'Fast storage and reliable connectivity are non-negotiable for professionals. GearDockGH stocks external SSDs, portable hard drives, USB-C hubs, and Wi-Fi routers — verified imports at cedis prices. Back up your work, expand your storage, and keep your internet fast.',
    faqs: [
      { question: 'What is the difference between SSD and HDD?', answer: 'SSDs are much faster and more durable than HDDs but cost more per gigabyte. For speed-critical work like video editing, SSDs are recommended.' },
      { question: 'Do you sell Wi-Fi routers for home offices?', answer: 'Yes — we stock routers suitable for home office use with good range and multiple device support.' },
      { question: 'Are USB-C hubs compatible with MacBooks?', answer: 'Most USB-C hubs we sell are compatible with MacBooks, Windows laptops, and iPads. Check product specifications for details.' },
    ],
  },
  {
    slug: 'tv-streaming',
    title: 'TV & Streaming',
    h1: 'Buy TVs & Streaming Devices in Ghana',
    description: 'Smart TVs, streaming sticks, and entertainment gear in Ghana.',
    metaDescription:
      'Buy smart TVs and streaming devices in Ghana. Verified imports, priced in cedis, with fast delivery nationwide.',
    intro:
      'Upgrade your entertainment setup with smart TVs and streaming devices from GearDockGH. Whether you want a big screen for your living room or a streaming stick for your bedroom, we have verified options at Ghana prices with fast delivery.',
    faqs: [
      { question: 'Do smart TVs work with Ghana internet speeds?', answer: 'Yes — modern smart TVs work well with standard Ghana broadband. For streaming, a minimum 10Mbps connection is recommended for HD content.' },
      { question: 'Do you deliver TVs safely?', answer: 'Yes — all TVs are carefully packaged with protective materials for safe delivery across Ghana.' },
      { question: 'Can I pay for a TV with MoMo in installments?', answer: 'Currently we accept full payment via MoMo, card, or bank transfer. Installment plans may be available in the future.' },
    ],
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    h1: 'Buy Tech Accessories in Ghana',
    description: 'Cables, hubs, docks, laptop stands, and desk accessories in Ghana.',
    metaDescription:
      'Buy tech accessories in Ghana — cables, USB hubs, laptop stands, and desk organizers. Complete your setup with verified gear.',
    intro:
      'The small things complete the setup. GearDockGH stocks cables, USB hubs, laptop stands, desk organizers, and other accessories that make your workspace work. All verified quality — no flimsy cables that break after a week.',
    faqs: [
      { question: 'Do your cables support fast charging?', answer: 'Yes — we stock USB-C cables that support fast charging and data transfer. Product descriptions specify supported charging speeds.' },
      { question: 'What laptop stand do you recommend?', answer: 'We stock adjustable aluminum laptop stands that improve ergonomics and airflow. Browse our accessories section for options.' },
      { question: 'Do you have cable management solutions?', answer: 'Yes — we carry cable clips, desk organizers, and cable management accessories to keep your workspace clean.' },
    ],
  },
];

export function getCategoryContent(slug: string): CategoryContent | undefined {
  return categoryContent.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return categoryContent.map((c) => c.slug);
}
