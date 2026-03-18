import { apiClient } from './client';
import type { Preorder } from '@/types';

interface CreatePreorderData {
  productId: string;
  quantity: number;
  notes?: string;
}

export async function createPreorder(data: CreatePreorderData) {
  return apiClient.post<Preorder>('/preorders', data);
}

export async function getPreorders(params?: { status?: string; page?: number; limit?: number }) {
  return apiClient.get<Preorder[]>('/preorders', { params });
}

export async function getPreorder(id: string) {
  return apiClient.get<Preorder>(`/preorders/${id}`);
}

export async function initializePreorderDeposit(
  preorderId: string,
  provider: string,
  callbackUrl?: string,
) {
  return apiClient.post<{
    paymentId: string;
    reference: string;
    authorizationUrl?: string;
    accessCode?: string;
  }>('/payments/preorder/deposit', { preorderId, provider, callbackUrl });
}

export async function initializeBalancePayment(
  preorderId: string,
  provider: string,
  callbackUrl?: string,
) {
  return apiClient.post<{
    paymentId: string;
    reference: string;
    authorizationUrl?: string;
    accessCode?: string;
  }>('/payments/preorder/balance', { preorderId, provider, callbackUrl });
}
