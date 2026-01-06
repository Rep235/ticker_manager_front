import type { AuthResponse, LoginPayload, RegisterPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', payload);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/register', payload);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  logout(): void {
    localStorage.removeItem('authToken');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
