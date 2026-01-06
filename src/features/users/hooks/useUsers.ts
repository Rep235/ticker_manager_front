import { useState, useEffect } from 'react';
import type { User } from '../../../types/index';
import { userService } from '../services/userService';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUsers = () => {
  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
  });

  const fetchUsers = async () => {
    setState({ users: [], loading: true, error: null });
    try {
      const users = await userService.getUsers();
      setState({ users, loading: false, error: null });
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al cargar usuarios';
      setState({ users: [], loading: false, error: message });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { ...state, refetch: fetchUsers };
};
