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

export const CATEGORIES = [
  { value: 'phones-tablets', label: 'Phones & Tablets', icon: '📱' },
  { value: 'laptops-computers', label: 'Laptops & Computers', icon: '💻' },
  { value: 'monitors-displays', label: 'Monitors & Displays', icon: '🖥️' },
  { value: 'audio-headphones', label: 'Audio & Headphones', icon: '🎧' },
  { value: 'keyboards-mice', label: 'Keyboards & Mice', icon: '⌨️' },
  { value: 'power-energy', label: 'Power & Energy', icon: '🔋' },
  { value: 'desks-furniture', label: 'Desks & Furniture', icon: '🪑' },
  { value: 'cameras-video', label: 'Cameras & Video', icon: '📷' },
  { value: 'gaming-consoles', label: 'Gaming Consoles', icon: '🎮' },
  { value: 'gaming-accessories', label: 'Gaming Accessories', icon: '🕹️' },
  { value: 'storage-networking', label: 'Storage & Networking', icon: '💾' },
  { value: 'lighting', label: 'Lighting', icon: '💡' },
  { value: 'accessories', label: 'Accessories', icon: '🔌' },
  { value: 'other', label: 'Other', icon: '📦' },
];
