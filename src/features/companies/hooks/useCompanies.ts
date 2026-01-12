import { useEffect, useState } from 'react';
import { companyService, type Company } from '../services/companyService';

interface UseCompaniesState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

export const useCompanies = () => {
  const [state, setState] = useState<UseCompaniesState>({
    companies: [],
    loading: true,
    error: null,
  });

  const fetchCompanies = async () => {
    setState({ companies: [], loading: true, error: null });
    try {
      const companies = await companyService.getCompanies();
      setState({ companies, loading: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error al cargar compañías';
      setState({ companies: [], loading: false, error: message });
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { ...state, refetch: fetchCompanies };
};
