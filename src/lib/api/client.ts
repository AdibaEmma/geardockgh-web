import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiResponse } from '@/types';

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  onTokenRefreshed: ((accessToken: string, refreshToken: string) => void) | null = null;
  onAuthFailure: (() => void) | null = null;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(this.attachToken);
    this.client.interceptors.response.use(
      (response) => response,
      this.handleResponseError,
    );
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private attachToken = (config: InternalAxiosRequestConfig) => {
    if (this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return config;
  };

  private handleResponseError = async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!this.refreshToken) {
      this.onAuthFailure?.();
      return Promise.reject(error);
    }

    if (this.isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        this.failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(this.client(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const response = await axios.post(
        `${this.client.defaults.baseURL}/auth/refresh`,
        { refreshToken: this.refreshToken },
      );

      const { accessToken, refreshToken } = response.data.data;
      this.setTokens(accessToken, refreshToken);
      this.onTokenRefreshed?.(accessToken, refreshToken);

      this.failedQueue.forEach(({ resolve }) => resolve(accessToken));
      this.failedQueue = [];

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return this.client(originalRequest);
    } catch (refreshError) {
      this.failedQueue.forEach(({ reject }) => reject(refreshError));
      this.failedQueue = [];
      this.onAuthFailure?.();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  };

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
