import type { AuthResponse, LoginPayload, RegisterPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';
import { parseJwt, isUuid } from '../../../lib/jwt';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/login', payload);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      const payload = parseJwt(data.token);
      const candidate = (payload?.userId as string) || (payload?.id as string) || (payload?.sub as string);
      if (candidate && isUuid(candidate)) {
        localStorage.setItem('userId', candidate);
      }
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await httpClient.post<AuthResponse>('/auth/register', payload);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      const parsed = parseJwt(data.token);
      const candidate = (parsed?.userId as string) || (parsed?.id as string) || (parsed?.sub as string);
      if (candidate && isUuid(candidate)) {
        localStorage.setItem('userId', candidate);
      }
    }
    return data;
  },

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('companyId');
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
