import { apiClient } from './client';
import type { Order, Product } from '@/types';

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenuePesewas: number;
  lowStockProducts: number;
  ordersByStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    totalPesewas: number;
    customerName: string;
    customerEmail: string;
    createdAt: string;
  }[];
  recentCustomers: {
    id: string;
    name: string;
    email: string;
    ordersCount: number;
    joinedAt: string;
  }[];
  topProducts: {
    productId: string;
    name: string;
    pricePesewas: number;
    stockCount: number;
    totalSold: number;
  }[];
}

interface AdminOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getAdminStats() {
  return apiClient.get<DashboardStats>('/admin/stats');
}

export async function getAdminOrders(params?: AdminOrdersParams) {
  return apiClient.get<Order[]>('/admin/orders', { params });
}

export async function getAdminOrder(id: string) {
  return apiClient.get<Order>(`/admin/orders/${id}`);
}

export async function updateOrderStatus(id: string, data: { status: string; notes?: string }) {
  return apiClient.patch<Order>(`/admin/orders/${id}`, data);
}

export async function bulkUpdateOrderStatus(data: { orderIds: string[]; status: string }) {
  return apiClient.patch<{ updatedCount: number }>('/admin/orders/bulk-status', data);
}

export interface CreateAdminOrderPayload {
  items: { productId: string; quantity: number; variantId?: string; selectedOptions?: string }[];
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerId?: string;
  paymentMethod: 'CASH' | 'MOMO' | 'BANK_TRANSFER';
  status?: string;
  notes?: string;
  deliveryFee?: number;
  discountPesewas?: number;
}

export async function createAdminOrder(data: CreateAdminOrderPayload) {
  return apiClient.post<Order>('/admin/orders', data);
}

export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  ordersCount: number;
  createdAt: string;
}

interface AdminCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AdminCustomersResponse {
  data: AdminCustomer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getAdminCustomers(params?: AdminCustomersParams) {
  return apiClient.get<AdminCustomersResponse>('/admin/customers', { params });
}

export async function getAdminCustomer(id: string) {
  return apiClient.get('/admin/customers/' + id);
}

// --- Tenants ---

export interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminTenants() {
  return apiClient.get<Tenant[]>('/admin/tenants');
}

export async function getAdminTenant(id: string) {
  return apiClient.get<Tenant>('/admin/tenants/' + id);
}

export async function createAdminTenant(data: { id: string; name: string }) {
  return apiClient.post<Tenant>('/admin/tenants', data);
}

export async function updateAdminTenant(id: string, data: { name?: string; isActive?: boolean }) {
  return apiClient.patch<Tenant>('/admin/tenants/' + id, data);
}

// --- ImportBrain Integration ---

export interface ImportBrainStatus {
  connected: boolean;
  status: string;
  hasPlatformKey: boolean;
  integrationId?: string;
  importbrainTenantId?: string;
  connectedAt?: string;
  disconnectedAt?: string;
}

export async function getImportBrainStatus() {
  return apiClient.get<ImportBrainStatus>('/admin/integrations/importbrain/status');
}

export async function saveImportBrainPlatformKey(platformKey: string) {
  return apiClient.post<{ success: boolean }>(
    '/admin/integrations/importbrain/platform-key',
    { platformKey },
  );
}

export async function connectImportBrain() {
  return apiClient.post<{ importbrainTenantId: string; integrationId: string; status: string }>(
    '/admin/integrations/importbrain/connect',
  );
}

export async function disconnectImportBrain() {
  return apiClient.delete('/admin/integrations/importbrain/disconnect');
}

export async function deleteImportBrainConnection() {
  return apiClient.delete('/admin/integrations/importbrain/connection');
}

export async function updateImportBrainPlatformKey(platformKey: string) {
  return apiClient.post<{ success: boolean }>(
    '/admin/integrations/importbrain/platform-key/update',
    { platformKey },
  );
}

export interface SyncResult {
  created: number;
  updated: number;
  skipped: number;
  total: number;
}

export async function syncImportBrainProducts() {
  return apiClient.post<SyncResult>('/admin/integrations/importbrain/sync');
}

// --- Admin Products ---

interface AdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string; // 'published' | 'draft'
  isPreorder?: boolean;
  isOnSale?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getAdminProducts(params?: AdminProductsParams) {
  return apiClient.get<{ data: Product[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/admin/products', { params });
}

export async function getAdminProductById(id: string) {
  return apiClient.get<Product>(`/admin/products/${id}`);
}

export async function createAdminProduct(data: {
  name: string;
  description?: string;
  pricePesewas: number;
  comparePricePesewas?: number;
  costPricePesewas?: number;
  stockCount?: number;
  isPreorder?: boolean;
  allowPreorderWhenOOS?: boolean;
  isPublished?: boolean;
  preorderSlotTarget?: number | null;
  shippingMethod?: string | null;
  category?: string;
  subcategory?: string;
  imagesJson?: string;
  specsJson?: string;
  optionsJson?: string;
}) {
  return apiClient.post<Product>('/admin/products', data);
}

export async function updateAdminProduct(id: string, data: Partial<{
  name: string;
  description: string;
  pricePesewas: number;
  comparePricePesewas: number;
  costPricePesewas: number;
  stockCount: number;
  isPreorder: boolean;
  allowPreorderWhenOOS: boolean;
  isPublished: boolean;
  preorderSlotTarget: number | null;
  shippingMethod: string | null;
  category: string;
  subcategory: string;
  imagesJson: string;
  specsJson: string;
  optionsJson: string;
}>) {
  return apiClient.patch<Product>(`/admin/products/${id}`, data);
}

export async function deleteAdminProduct(id: string) {
  return apiClient.delete(`/admin/products/${id}`);
}

export async function toggleAdminProductPublish(id: string) {
  return apiClient.patch<Product>(`/admin/products/${id}/toggle-publish`);
}

export async function toggleAdminProductFeatured(id: string) {
  return apiClient.patch<Product>(`/admin/products/${id}/toggle-featured`);
}

export async function toggleAdminProductFlashDeal(id: string) {
  return apiClient.patch<Product>(`/admin/products/${id}/toggle-flash-deal`);
}

export interface ProductAuditLog {
  id: string;
  action: string;
  changes: string | null;
  userId: string | null;
  createdAt: string;
}

export async function getProductAuditLogs(id: string) {
  return apiClient.get<ProductAuditLog[]>(`/admin/products/${id}/audit-logs`);
}

// ─── LEADS ────────────────────────────────────────────────────

export interface Lead {
  id: string;
  email: string;
  customerId: string | null;
  source: string;
  status: string;
  score: number;
  firstTouchAt: string;
  lastActivityAt: string;
  convertedAt: string | null;
  convertedOrderId: string | null;
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
  activities?: LeadActivity[];
}

export interface LeadActivity {
  id: string;
  action: string;
  productId: string | null;
  metadata: string | null;
  scoreDelta: number;
  createdAt: string;
}

export interface LeadPipeline {
  NEW: number;
  ENGAGED: number;
  QUALIFIED: number;
  CONVERTED: number;
  INACTIVE: number;
}

export interface LeadStats {
  pipeline: LeadPipeline;
  totalLeads: number;
  conversionRate: number;
  sourceBreakdown: Record<string, number>;
  avgTimeToConversion: number | null;
  recentLeads: Lead[];
}

export interface LeadScoringRule {
  id: string;
  action: string;
  points: number;
  isActive: boolean;
}

export interface LeadQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  minScore?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getAdminLeads(params?: LeadQueryParams) {
  return apiClient.get<Lead[]>('/admin/leads', { params });
}

export async function getAdminLead(id: string) {
  return apiClient.get<Lead>(`/admin/leads/${id}`);
}

export async function getAdminLeadStats() {
  return apiClient.get<LeadStats>('/admin/leads/stats');
}

export async function getAdminScoringRules() {
  return apiClient.get<LeadScoringRule[]>('/admin/leads/scoring-rules');
}

export async function updateAdminScoringRules(rules: { action: string; points: number; isActive?: boolean }[]) {
  return apiClient.put<LeadScoringRule[]>('/admin/leads/scoring-rules', { rules });
}

export async function backfillLeads() {
  return apiClient.post<{ created: number; updated: number; total: number }>('/admin/leads/backfill');
}

// ─── DISCOUNTS ────────────────────────────────────────────────

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderPesewas: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface CreateDiscountPayload {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderPesewas?: number;
  maxUses?: number;
  expiresAt?: string;
}

export async function getAdminDiscounts(params?: { page?: number; limit?: number; search?: string }) {
  return apiClient.get<DiscountCode[]>('/admin/discounts', { params });
}

export async function createAdminDiscount(data: CreateDiscountPayload) {
  return apiClient.post<DiscountCode>('/admin/discounts', data);
}

export async function toggleDiscountActive(id: string) {
  return apiClient.patch<DiscountCode>(`/admin/discounts/${id}/toggle`);
}

export async function deleteAdminDiscount(id: string) {
  return apiClient.delete(`/admin/discounts/${id}`);
}

export async function validateDiscountCode(code: string, subtotalPesewas: number) {
  return apiClient.post<{ valid: boolean; discountPesewas: number; type: string; message: string }>('/discounts/validate', { code, subtotalPesewas });
}
