export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending Payment',
  PAYMENT_CONFIRMED: 'Payment Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export const PREORDER_STATUS_LABELS: Record<string, string> = {
  RESERVED: 'Reserved',
  DEPOSIT_PAID: 'Deposit Paid',
  FULLY_PAID: 'Fully Paid',
  READY_TO_SHIP: 'Ready to Ship',
  FULFILLED: 'Fulfilled',
  CANCELLED: 'Cancelled',
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-500/10 text-yellow-400',
  PAYMENT_CONFIRMED: 'bg-blue-500/10 text-blue-400',
  PROCESSING: 'bg-indigo-500/10 text-indigo-400',
  SHIPPED: 'bg-cyan-500/10 text-cyan-400',
  DELIVERED: 'bg-green-500/10 text-green-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
  REFUNDED: 'bg-orange-500/10 text-orange-400',
  RESERVED: 'bg-yellow-500/10 text-yellow-400',
  DEPOSIT_PAID: 'bg-blue-500/10 text-blue-400',
  FULLY_PAID: 'bg-green-500/10 text-green-400',
  READY_TO_SHIP: 'bg-teal-500/10 text-teal-400',
  FULFILLED: 'bg-green-500/10 text-green-400',
  PENDING: 'bg-yellow-500/10 text-yellow-400',
  SUCCESS: 'bg-green-500/10 text-green-400',
  FAILED: 'bg-red-500/10 text-red-400',
};

// ─── Category Tree ──────────────────────────────────────────

export interface SubCategory {
  value: string;
  label: string;
}

export interface CategoryNode {
  value: string;
  label: string;
  icon: string;
  subcategories?: SubCategory[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    value: 'phones-tablets',
    label: 'Phones & Tablets',
    icon: 'Smartphone',
    subcategories: [
      { value: 'phones', label: 'Phones' },
      { value: 'tablets', label: 'Tablets' },
    ],
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: 'Headphones',
    subcategories: [
      { value: 'headphones', label: 'Headphones' },
      { value: 'speakers', label: 'Speakers' },
      { value: 'microphones', label: 'Microphones' },
    ],
  },
  {
    value: 'computing',
    label: 'Computing',
    icon: 'Laptop',
    subcategories: [
      { value: 'laptops', label: 'Laptops' },
      { value: 'monitors', label: 'Monitors' },
      { value: 'keyboards-mice', label: 'Keyboards & Mice' },
    ],
  },
  {
    value: 'gaming',
    label: 'Gaming',
    icon: 'Gamepad2',
    subcategories: [
      { value: 'consoles', label: 'Consoles' },
      { value: 'gaming-accessories', label: 'Gaming Accessories' },
    ],
  },
  {
    value: 'power-energy',
    label: 'Power & Energy',
    icon: 'Battery',
    subcategories: [
      { value: 'power-banks', label: 'Power Banks' },
      { value: 'generators-stations', label: 'Generators / Stations' },
      { value: 'ups-surge', label: 'UPS / Surge Protectors' },
    ],
  },
  {
    value: 'home-office',
    label: 'Home & Office',
    icon: 'Armchair',
    subcategories: [
      { value: 'desks-furniture', label: 'Desks & Furniture' },
      { value: 'lighting', label: 'Lighting' },
      { value: 'fans-cooling', label: 'Fans & Cooling' },
    ],
  },
  { value: 'cameras-video', label: 'Cameras & Video', icon: 'Camera' },
  { value: 'storage-networking', label: 'Storage & Networking', icon: 'HardDrive' },
  { value: 'tv-streaming', label: 'TV & Streaming', icon: 'Tv' },
  { value: 'accessories', label: 'Accessories', icon: 'Cable' },
];

/** Flat list derived from tree — backward compat for admin dropdown etc. */
export const CATEGORIES = CATEGORY_TREE.map(({ value, label, icon }) => ({ value, label, icon }));
