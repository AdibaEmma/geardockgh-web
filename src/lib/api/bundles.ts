import { apiClient } from './client';
import type { Bundle } from '@/types';

export async function getBundles() {
  return apiClient.get<Bundle[]>('/bundles');
}

export async function getFeaturedBundles() {
  return apiClient.get<Bundle[]>('/bundles/featured');
}

export async function getBundle(slug: string) {
  return apiClient.get<Bundle>(`/bundles/${slug}`);
}
