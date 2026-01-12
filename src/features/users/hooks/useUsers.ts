import { useState, useEffect, useCallback } from 'react';
import type { User } from '../../../types/index';
import { userService, type PaginatedResponse } from '../services/userService';

interface UseUsersOptions {
  companyId?: string;
  initialPage?: number;
  initialPageSize?: number;
}

interface UseUsersState extends UseUsersOptions {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const { companyId, initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState<UseUsersState>({
    users: [],
    loading: false,
    error: null,
    total: 0,
    totalPages: 0,
    companyId,
    initialPage,
    initialPageSize,
  });

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const fetchUsers = useCallback(async () => {
    setState((prev) => ({ ...prev, users: [], loading: true, error: null }));
    try {
      const offset = (page - 1) * pageSize;
      const result: PaginatedResponse<User> = await userService.getUsers(companyId, offset, pageSize);
      setState((prev) => ({
        ...prev,
        users: result.data,
        loading: false,
        error: null,
        total: result.total,
        totalPages: result.totalPages ?? Math.ceil(result.total / result.limit),
      }));
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al cargar usuarios';
      setState((prev) => ({ ...prev, users: [], loading: false, error: message }));
    }
  }, [companyId, page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(Math.max(1, p));

  return {
    users: state.users,
    loading: state.loading,
    error: state.error,
    total: state.total,
    totalPages: state.totalPages,
    page,
    pageSize,
    setPageSize,
    nextPage,
    prevPage,
    goToPage,
    refetch: fetchUsers,
  };
};
