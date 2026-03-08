import { apiClient } from './client';
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '@/types';

export async function login(data: LoginRequest) {
  return apiClient.post<AuthResponse>('/auth/login', data);
}

export async function register(data: RegisterRequest) {
  return apiClient.post<AuthResponse>('/auth/register', data);
}

export async function refreshToken(token: string) {
  return apiClient.post<AuthResponse>('/auth/refresh', { refreshToken: token });
}

export async function logout(token: string) {
  return apiClient.post<void>('/auth/logout', { refreshToken: token });
}

export async function getProfile() {
  return apiClient.get<AuthUser>('/auth/profile');
}
