export interface SocialPost {
  id: string;
  dayNumber: number;
  platform: 'twitter' | 'instagram' | 'tiktok';
  type:
    | 'product-showcase'
    | 'tip'
    | 'testimonial'
    | 'behind-scenes'
    | 'promo'
    | 'educational'
    | 'engagement';
  caption: string;
  hashtags: string[];
  notes?: string;
}

export const socialContentCalendar: SocialPost[] = [
  {
    id: 'gdgh-01',
    dayNumber: 1,
    platform: 'instagram',
    type: 'product-showcase',
    caption:
      'Your remote work setup starts here. Explore our curated collection of laptops, monitors, and peripherals built for professionals in Ghana. Shop now at GearDockGH.',
    hashtags: [
      '#GearDockGH',
      '#RemoteWorkGhana',
      '#TechGhana',
      '#WorkFromHome',
    ],
    notes: 'Carousel post: 4-5 product images with clean backgrounds.',
  },
  {
    id: 'gdgh-02',
    dayNumber: 3,
    platform: 'twitter',
    type: 'tip',
    caption:
      'Tip: Invest in a second monitor. Studies show dual screens can boost productivity by up to 42%. We stock affordable options starting from GHS 1,200. Link in bio.',
    hashtags: ['#ProductivityTip', '#GearDockGH', '#TechTipsGhana'],
  },
  {
    id: 'gdgh-03',
    dayNumber: 5,
    platform: 'tiktok',
    type: 'behind-scenes',
    caption:
      'POV: You ordered tech gear from GearDockGH and it arrived the next day. Watch us pack and ship your order with care.',
    hashtags: [
      '#GearDockGH',
      '#PackWithMe',
      '#GhanaTech',
      '#UnboxingGhana',
    ],
    notes:
      'Short-form video showing warehouse packing process with upbeat music.',
  },
  {
    id: 'gdgh-04',
    dayNumber: 8,
    platform: 'instagram',
    type: 'educational',
    caption:
      'Mechanical vs Membrane Keyboard: Which one is right for you? Swipe to learn the differences and find the perfect keyboard for your workflow.',
    hashtags: [
      '#GearDockGH',
      '#KeyboardGuide',
      '#TechEducation',
      '#GhanaDev',
    ],
    notes: 'Carousel with comparison graphics. End slide links to shop.',
  },
  {
    id: 'gdgh-05',
    dayNumber: 10,
    platform: 'twitter',
    type: 'engagement',
    caption:
      'What is the ONE piece of tech you cannot work without? Drop your answer below. Ours? A good noise-cancelling headset.',
    hashtags: ['#GearDockGH', '#TechTalk', '#GhanaTech'],
    notes: 'Engagement post. Reply to every comment within 2 hours.',
  },
  {
    id: 'gdgh-06',
    dayNumber: 12,
    platform: 'tiktok',
    type: 'product-showcase',
    caption:
      'The desk setup that will make your colleagues jealous. Everything you see is available on GearDockGH. Laptop stand, monitor arm, wireless keyboard and mouse combo.',
    hashtags: [
      '#DeskSetup',
      '#GearDockGH',
      '#CleanDesk',
      '#RemoteWorkGhana',
    ],
    notes: 'Aesthetic desk reveal video with transition effect.',
  },
  {
    id: 'gdgh-07',
    dayNumber: 15,
    platform: 'instagram',
    type: 'testimonial',
    caption:
      '"I ordered my MacBook charger on Friday evening and received it Saturday morning. GearDockGH delivery is unmatched." - Kwame A., Accra. Shop with confidence.',
    hashtags: [
      '#GearDockGH',
      '#CustomerReview',
      '#TrustedTech',
      '#AccraTech',
    ],
    notes: 'Quote card design with customer photo (with permission).',
  },
  {
    id: 'gdgh-08',
    dayNumber: 17,
    platform: 'twitter',
    type: 'promo',
    caption:
      'Weekend Flash Sale: 15% off all webcams and ring lights. Perfect for your Zoom calls and content creation. Use code SHINE15 at checkout. Ends Sunday.',
    hashtags: [
      '#GearDockGH',
      '#FlashSale',
      '#ContentCreatorGhana',
      '#TechDeals',
    ],
  },
  {
    id: 'gdgh-09',
    dayNumber: 19,
    platform: 'tiktok',
    type: 'educational',
    caption:
      '3 things to check before buying a laptop in Ghana: 1. Warranty coverage 2. RAM and storage specs 3. Battery life for power outages. Save this for later.',
    hashtags: [
      '#LaptopBuyingGuide',
      '#GearDockGH',
      '#TechTipsGhana',
      '#GhanaTech',
    ],
    notes: 'Talking head video with text overlays for each point.',
  },
  {
    id: 'gdgh-10',
    dayNumber: 22,
    platform: 'instagram',
    type: 'behind-scenes',
    caption:
      'A look inside our quality check process. Every product that leaves GearDockGH is tested, inspected, and sealed before it gets to you. No surprises, just quality.',
    hashtags: [
      '#GearDockGH',
      '#QualityFirst',
      '#BehindTheScenes',
      '#TechGhana',
    ],
    notes: 'Reel or carousel showing QC process steps.',
  },
  {
    id: 'gdgh-11',
    dayNumber: 24,
    platform: 'twitter',
    type: 'engagement',
    caption:
      'Build your dream desk setup with a GHS 5,000 budget. What are you picking? We will feature the best combos in our next post.',
    hashtags: ['#GearDockGH', '#DeskSetupChallenge', '#TechGhana'],
    notes: 'UGC-style engagement. Repost best replies as stories.',
  },
  {
    id: 'gdgh-12',
    dayNumber: 26,
    platform: 'instagram',
    type: 'promo',
    caption:
      'Free delivery on all orders above GHS 500 this week. Stock up on cables, chargers, and accessories without worrying about shipping. Shop link in bio.',
    hashtags: [
      '#GearDockGH',
      '#FreeDelivery',
      '#TechAccessories',
      '#ShopGhana',
    ],
    notes: 'Single image with bold promo text overlay.',
  },
  {
    id: 'gdgh-13',
    dayNumber: 29,
    platform: 'tiktok',
    type: 'tip',
    caption:
      'Your laptop is overheating? Try these 3 fixes before spending money: 1. Clean the vents 2. Use a laptop stand for airflow 3. Check background apps eating CPU. You are welcome.',
    hashtags: [
      '#TechTips',
      '#GearDockGH',
      '#LaptopCare',
      '#GhanaTech',
    ],
    notes:
      'Quick tips video, under 60 seconds. End with CTA to shop laptop stands.',
  },
];
