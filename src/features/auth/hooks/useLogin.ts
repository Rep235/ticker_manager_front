import { useState } from 'react';
import type { LoginPayload, AuthResponse } from '../../../types/index';
import { authService } from '../services/authService';

interface UseLoginState {
  loading: boolean;
  error: string | null;
}

export const useLogin = () => {
  const [state, setState] = useState<UseLoginState>({
    loading: false,
    error: null,
  });

  const login = async (payload: LoginPayload): Promise<AuthResponse | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await authService.login(payload);
      setState({ loading: false, error: null });
      return result;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error al iniciar sesión';
      setState({ loading: false, error: message });
      return null;
    }
  };

  return { ...state, login };
};
