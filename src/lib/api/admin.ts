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

// --- Admin Products ---

interface AdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string; // 'published' | 'draft'
}

export async function getAdminProducts(params?: AdminProductsParams) {
  return apiClient.get<{ data: Product[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/admin/products', { params });
}

export async function createAdminProduct(data: {
  name: string;
  description?: string;
  pricePesewas: number;
  comparePricePesewas?: number;
  stockCount?: number;
  isPreorder?: boolean;
  isPublished?: boolean;
  category?: string;
  imagesJson?: string;
  specsJson?: string;
}) {
  return apiClient.post<Product>('/admin/products', data);
}

export async function updateAdminProduct(id: string, data: Partial<{
  name: string;
  description: string;
  pricePesewas: number;
  comparePricePesewas: number;
  stockCount: number;
  isPreorder: boolean;
  isPublished: boolean;
  category: string;
  imagesJson: string;
  specsJson: string;
}>) {
  return apiClient.patch<Product>(`/admin/products/${id}`, data);
}

export async function deleteAdminProduct(id: string) {
  return apiClient.delete(`/admin/products/${id}`);
}
