export interface Email {
  id: string;
  sequence: string;
  order: number;
  subject: string;
  preheader: string;
  body: string;
  delayDays: number;
  cta?: { text: string; url: string };
}

// ── Welcome Sequence ──────────────────────────────────────────────────────────

const welcomeSequence: Email[] = [
  {
    id: 'welcome-1',
    sequence: 'welcome',
    order: 1,
    subject: 'Welcome to GearDockGH — Here\'s GH₵ 20 Off Your First Order',
    preheader: 'Your discount code is inside. Let\'s get you geared up.',
    body: `Hey there,

Welcome to GearDockGH — your plug for quality tech gear right here in Ghana.

Whether you need headphones for your commute, a laptop for work, gaming accessories, or power solutions for those dumsor nights — we've got you covered.

To kick things off, here's GH₵ 20 off your first order. Use code WELCOME20 at checkout.

We accept Mobile Money (MTN, Vodafone, AirtelTigo) so paying is easy. And we deliver fast — straight to your doorstep.

Got questions? Hit us up on WhatsApp anytime. We're always here.

Welcome aboard,
The GearDockGH Team`,
    delayDays: 0,
    cta: {
      text: 'Shop Now & Save GH₵ 20',
      url: 'https://geardockgh.com/shop?discount=WELCOME20',
    },
  },
  {
    id: 'welcome-2',
    sequence: 'welcome',
    order: 2,
    subject: 'Top Picks Our Customers Can\'t Stop Buying',
    preheader: 'These are flying off the shelves. See what\'s trending.',
    body: `Hey,

You joined GearDockGH — nice move. Now let's get you something good.

Here's what our customers have been grabbing lately:

- Wireless earbuds that actually last all day
- Budget-friendly laptops perfect for students and professionals
- Gaming controllers and accessories
- Portable chargers and power banks

Everything ships fast from Bolgatanga, and you can pay with MoMo. No stress.

Haven't used your WELCOME20 code yet? It's still waiting for you.

Browse the shop and find your perfect gear.

Cheers,
The GearDockGH Team`,
    delayDays: 2,
    cta: {
      text: 'See What\'s Trending',
      url: 'https://geardockgh.com/shop?sort=popular',
    },
  },
  {
    id: 'welcome-3',
    sequence: 'welcome',
    order: 3,
    subject: 'Dumsor-Proof Your Setup — Power & Energy Essentials',
    preheader: 'Never lose power again. Backup solutions that actually work.',
    body: `Hey,

Let's talk about the elephant in the room — dumsor.

Nothing kills productivity (or a gaming session) like a sudden blackout. That's why we stocked up on power solutions you can actually rely on:

- UPS systems to keep your laptop and router running
- High-capacity power banks for phones and tablets
- Solar charging kits for off-grid power
- Surge protectors to keep your gear safe

Don't wait until the lights go out to prepare. Get your backup sorted now and keep working, streaming, or gaming no matter what ECG throws at you.

Your WELCOME20 code works on power gear too. Just saying.

Stay powered,
The GearDockGH Team`,
    delayDays: 5,
    cta: {
      text: 'Shop Power & Energy',
      url: 'https://geardockgh.com/category/power-energy',
    },
  },
];

// ── Post-Purchase Sequence ────────────────────────────────────────────────────

const postPurchaseSequence: Email[] = [
  {
    id: 'post-purchase-1',
    sequence: 'post-purchase',
    order: 1,
    subject: 'Order Confirmed — Your Gear Is on the Way',
    preheader: 'We\'ve got your order. Here\'s what happens next.',
    body: `Hey,

Your order is confirmed and we're getting it ready for delivery. You'll receive a notification once it ships.

While you wait — want to earn some credit?

Refer a friend to GearDockGH and you both get GH₵ 15 off your next order. Just share your unique referral link below.

It's simple: they shop, you both save. Everyone wins.

Got questions about your order? Send us a WhatsApp message and we'll sort you out fast.

Thanks for shopping with us,
The GearDockGH Team`,
    delayDays: 0,
    cta: {
      text: 'Share & Earn GH₵ 15',
      url: 'https://geardockgh.com/referral',
    },
  },
  {
    id: 'post-purchase-2',
    sequence: 'post-purchase',
    order: 2,
    subject: 'How\'s Your New Gear? We\'d Love to Know',
    preheader: 'Quick question — are you happy with your purchase?',
    body: `Hey,

Your order should have arrived by now. How's everything looking?

We'd love to hear what you think. A quick review helps other shoppers make confident decisions, and it helps us keep stocking the gear you actually want.

It takes less than 2 minutes:

1. Click the link below
2. Rate your product (1-5 stars)
3. Share a quick thought

That's it. Your feedback genuinely matters to us.

If anything isn't right with your order, don't leave a bad review — just WhatsApp us first. We'll make it right.

Thanks for being part of the GearDockGH family,
The GearDockGH Team`,
    delayDays: 5,
    cta: {
      text: 'Leave a Quick Review',
      url: 'https://geardockgh.com/reviews',
    },
  },
  {
    id: 'post-purchase-3',
    sequence: 'post-purchase',
    order: 3,
    subject: 'Time for a Restock? Your Favourites Are Waiting',
    preheader: 'It\'s been a month — might be time to grab some extras.',
    body: `Hey,

It's been about a month since your last order. How's your gear holding up?

If you're running low on accessories, need a backup charger, or have been eyeing something new — now's a great time to check back in.

We've added some fresh products since your last visit, and your favourites are still in stock (for now).

Remember, we deliver fast and you can pay with MoMo. Same easy experience every time.

Come see what's new,
The GearDockGH Team`,
    delayDays: 30,
    cta: {
      text: 'Shop New Arrivals',
      url: 'https://geardockgh.com/shop?sort=newest',
    },
  },
];

// ── Abandoned Cart Sequence ───────────────────────────────────────────────────

const abandonedCartSequence: Email[] = [
  {
    id: 'abandoned-cart-1',
    sequence: 'abandoned-cart',
    order: 1,
    subject: 'You Left Something Behind',
    preheader: 'Your cart is saved. Come back and finish your order.',
    body: `Hey,

Looks like you added some gear to your cart but didn't finish checking out. No worries — your items are saved and waiting for you.

Maybe you got distracted, maybe the network cut, maybe dumsor struck. It happens.

Your cart is ready whenever you are. Just click below to pick up where you left off.

Need help deciding? Have questions about a product? Chat with us on WhatsApp and we'll help you out right away.

We're here for you,
The GearDockGH Team`,
    delayDays: 1,
    cta: {
      text: 'Complete Your Order',
      url: 'https://geardockgh.com/cart',
    },
  },
  {
    id: 'abandoned-cart-2',
    sequence: 'abandoned-cart',
    order: 2,
    subject: 'Last Call — Your Cart Items Are Going Fast',
    preheader: 'Stock is limited. Don\'t miss out on your picks.',
    body: `Hey,

Just a heads up — the items in your cart are popular and stock is limited. We can't guarantee they'll be available much longer.

We'd hate for you to miss out on what you picked. If price was the issue, remember you might still have a discount code waiting.

This is your last reminder. After this, we'll clear your saved cart.

Tap below to finish your order. Pay with MoMo, get fast delivery, done.

Don't sleep on it,
The GearDockGH Team`,
    delayDays: 3,
    cta: {
      text: 'Grab Your Gear Now',
      url: 'https://geardockgh.com/cart',
    },
  },
];

// ── Exports ───────────────────────────────────────────────────────────────────

export const emailSequences: Email[] = [
  ...welcomeSequence,
  ...postPurchaseSequence,
  ...abandonedCartSequence,
];

export const getSequence = (name: string): Email[] =>
  emailSequences.filter((e) => e.sequence === name).sort((a, b) => a.order - b.order);

export const getEmailById = (id: string): Email | undefined =>
  emailSequences.find((e) => e.id === id);
