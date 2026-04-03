type GtagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

function sendEvent({ action, ...params }: GtagEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
}

// ── E-commerce Events ──

export function trackViewItem(item: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) {
  sendEvent({
    action: 'view_item',
    currency: 'GHS',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
      },
    ],
  });
}

export function trackAddToCart(item: {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}) {
  sendEvent({
    action: 'add_to_cart',
    currency: 'GHS',
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  });
}

export function trackBeginCheckout(value: number, itemCount: number) {
  sendEvent({
    action: 'begin_checkout',
    currency: 'GHS',
    value,
    items_count: itemCount,
  });
}

export function trackPurchase(transaction: {
  id: string;
  value: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}) {
  sendEvent({
    action: 'purchase',
    transaction_id: transaction.id,
    currency: 'GHS',
    value: transaction.value,
    items: transaction.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// ── Engagement Events ──

export function trackWhatsAppClick(context: 'product' | 'general') {
  sendEvent({
    action: 'whatsapp_click',
    category: 'engagement',
    label: context,
  });
}

export function trackNewsletterSignup() {
  sendEvent({
    action: 'newsletter_signup',
    category: 'engagement',
  });
}

export function trackProductSearch(query: string) {
  sendEvent({
    action: 'search',
    search_term: query,
  });
}

// ── Type augmentation for window.gtag ──

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
