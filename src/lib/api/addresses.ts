import { apiClient } from './client';
import type { Address } from '@/types';

interface CreateAddressRequest {
  label?: string;
  street: string;
  city: string;
  region: string;
  isDefault?: boolean;
}

interface UpdateAddressRequest {
  label?: string;
  street?: string;
  city?: string;
  region?: string;
  isDefault?: boolean;
}

export async function getAddresses() {
  return apiClient.get<Address[]>('/addresses');
}

export async function getAddress(id: string) {
  return apiClient.get<Address>(`/addresses/${id}`);
}

export async function createAddress(data: CreateAddressRequest) {
  return apiClient.post<Address>('/addresses', data);
}

export async function updateAddress(id: string, data: UpdateAddressRequest) {
  return apiClient.patch<Address>(`/addresses/${id}`, data);
}

export async function deleteAddress(id: string) {
  return apiClient.delete<void>(`/addresses/${id}`);
}
