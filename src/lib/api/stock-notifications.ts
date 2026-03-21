import { apiClient } from './client';

export async function subscribeStockNotification(productId: string) {
  return apiClient.post<{ subscribed: boolean; alreadySubscribed: boolean }>(
    '/stock-notifications',
    { productId },
  );
}

export async function unsubscribeStockNotification(productId: string) {
  return apiClient.delete<{ subscribed: boolean }>(
    `/stock-notifications/${productId}`,
  );
}

export async function checkStockNotification(productId: string) {
  return apiClient.get<{ subscribed: boolean }>(
    `/stock-notifications/${productId}`,
  );
}
