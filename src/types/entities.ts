// Order Status
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PreorderStatus =
  | 'RESERVED'
  | 'DEPOSIT_PAID'
  | 'FULLY_PAID'
  | 'READY_TO_SHIP'
  | 'FULFILLED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'PAYSTACK' | 'MOMO' | 'BANK_TRANSFER';

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  pricePesewas: number;
  comparePricePesewas: number | null;
  stockCount: number;
  isPreorder: boolean;
  isPublished: boolean;
  estArrivalDate: string | null;
  category: string | null;
  imagesJson: string | null;
  specsJson: string | null;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  pricePesewas: number;
  stockCount: number;
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalPesewas: number;
  subtotalPesewas: number;
  deliveryFee: number;
  discountPesewas: number;
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  variantId: string | null;
  variant: ProductVariant | null;
  quantity: number;
  unitPricePesewas: number;
}

// Preorder
export interface Preorder {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  depositPesewas: number;
  totalPesewas: number;
  estArrivalDate: string | null;
  status: PreorderStatus;
  createdAt: string;
}

// Payment
export interface Payment {
  id: string;
  provider: PaymentProvider;
  transactionId: string | null;
  reference: string | null;
  amountPesewas: number;
  status: PaymentStatus;
  paidAt: string | null;
}

// Address
export interface Address {
  id: string;
  label: string | null;
  street: string;
  city: string;
  region: string;
  isDefault: boolean;
}
