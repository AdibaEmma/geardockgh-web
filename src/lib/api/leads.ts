import { apiClient } from './client';

/**
 * Fire-and-forget lead event tracking.
 * Call alongside GA4 events for server-side lead tracking.
 */
export function trackLeadEvent(data: {
  email?: string;
  action: string;
  productId?: string;
  metadata?: Record<string, unknown>;
}): void {
  apiClient
    .post('/leads/track', {
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
    })
    .catch(() => {}); // silent — never block the user
}
