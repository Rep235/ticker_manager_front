import { useState } from 'react';
import type { User } from '../../../types/index';
import { userService, type CreateUserPayload } from '../services/userService';

interface UseCreateUserState {
  loading: boolean;
  error: string | null;
}

export const useCreateUser = () => {
  const [state, setState] = useState<UseCreateUserState>({
    loading: false,
    error: null,
  });

  const createUser = async (payload: CreateUserPayload): Promise<User | null> => {
    setState({ loading: true, error: null });
    try {
      const user = await userService.createUser(payload);
      setState({ loading: false, error: null });
      return user;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al crear usuario';
      setState({ loading: false, error: message });
      return null;
    }
  };

  return { ...state, createUser };
};
