import { apiClient } from './client';
import type { Order } from '@/types';

interface CreateOrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedOptions?: string;
}

interface CreateOrderRequest {
  items: CreateOrderItem[];
  addressId?: string;
  notes?: string;
}

interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
}

export async function getOrders(params?: GetOrdersParams) {
  return apiClient.get<Order[]>('/orders', { params });
}

export async function getOrder(id: string) {
  return apiClient.get<Order>(`/orders/${id}`);
}

export async function createOrder(data: CreateOrderRequest) {
  return apiClient.post<Order>('/orders', data);
}

export async function cancelOrder(id: string) {
  return apiClient.post<Order>(`/orders/${id}/cancel`);
}
