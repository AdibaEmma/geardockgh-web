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

// Product Options
export interface ProductOptionValue {
  label: string;
  hex?: string;
  priceDelta?: number;
}

export interface ProductOption {
  name: string;
  type: 'color' | 'text';
  values: ProductOptionValue[];
}

export interface SelectedOption {
  name: string;
  value: string;
  priceDelta?: number;
}

// Product
export interface Product {
  id: string;
  importbrainProductId: string | null;
  name: string;
  slug: string;
  description: string | null;
  pricePesewas: number;
  comparePricePesewas: number | null;
  costPricePesewas: number | null;
  stockCount: number;
  isPreorder: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  estArrivalDate: string | null;
  preorderDepositType: string | null;
  preorderDepositValue: number | null;
  preorderMinUnits: number | null;
  preorderSlotsTaken: number;
  preorderSlotTarget: number | null;
  category: string | null;
  imagesJson: string | null;
  specsJson: string | null;
  optionsJson: string | null;
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
  notes?: string | null;
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
  selectedOptionsJson: string | null;
}

// Preorder
export interface Preorder {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  depositPesewas: number;
  totalPesewas: number;
  balancePesewas: number;
  paystackBalanceReference: string | null;
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

// Bundle
export interface BundleItem {
  id: string;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'pricePesewas' | 'imagesJson' | 'category'>;
  quantity: number;
  isBonus: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  pricePesewas: number;
  comparePricePesewas: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  isPreorder: boolean;
  stockCount: number;
  imageUrl: string | null;
  category: string | null;
  items: BundleItem[];
  createdAt: string;
  updatedAt: string;
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
