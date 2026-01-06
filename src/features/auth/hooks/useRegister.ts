import { useState } from 'react';
import type { RegisterPayload, AuthResponse } from '../../../types/index';
import { authService } from '../services/authService';

interface UseRegisterState {
  loading: boolean;
  error: string | null;
}

export const useRegister = () => {
  const [state, setState] = useState<UseRegisterState>({
    loading: false,
    error: null,
  });

  const register = async (payload: RegisterPayload): Promise<AuthResponse | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await authService.register(payload);
      setState({ loading: false, error: null });
      return result;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Error al registrarse';
      setState({ loading: false, error: message });
      return null;
    }
  };

  return { ...state, register };
};
