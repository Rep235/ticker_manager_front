import { useEffect, useState, useCallback } from 'react';
import { companyService, type Company, type PaginatedResponse } from '../services/companyService';

interface UseCompaniesOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseCompaniesState extends UseCompaniesOptions {
  companies: Company[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

export const useCompanies = (options: UseCompaniesOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState<UseCompaniesState>({
    companies: [],
    loading: true,
    error: null,
    total: 0,
    totalPages: 0,
    initialPage,
    initialPageSize,
  });

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const fetchCompanies = useCallback(async () => {
    setState((prev) => ({ ...prev, companies: [], loading: true, error: null }));
    try {
      const offset = (page - 1) * pageSize;
      const result: PaginatedResponse<Company> = await companyService.getCompanies(offset, pageSize);
      setState((prev) => ({
        ...prev,
        companies: result.data,
        loading: false,
        error: null,
        total: result.total,
        totalPages: result.totalPages ?? Math.ceil(result.total / result.limit),
      }));
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error al cargar compañías';
      setState((prev) => ({ ...prev, companies: [], loading: false, error: message }));
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(Math.max(1, p));

  return {
    companies: state.companies,
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
    refetch: fetchCompanies,
  };
};
