import { apiClient } from './client';

interface InitializePaymentRequest {
  orderId: string;
  provider: 'PAYSTACK' | 'MOMO' | 'BANK_TRANSFER';
  callbackUrl?: string;
}

interface PaystackPaymentResponse {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
}

interface ManualPaymentResponse {
  paymentId: string;
  reference: string;
  provider: string;
  amountPesewas: number;
}

export async function initializePayment(data: InitializePaymentRequest) {
  return apiClient.post<PaystackPaymentResponse | ManualPaymentResponse>(
    '/payments/initialize',
    data,
  );
}

export async function verifyPayment(reference: string) {
  return apiClient.get<Record<string, unknown>>(
    `/payments/verify/${reference}`,
  );
}
