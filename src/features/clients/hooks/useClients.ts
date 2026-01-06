import { useState, useEffect } from 'react';
import type { Client } from '../../../types/index';
import { clientService } from '../services/clientService';

interface UseClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

export const useClients = () => {
  const [state, setState] = useState<UseClientsState>({
    clients: [],
    loading: false,
    error: null,
  });

  const fetchClients = async () => {
    setState({ clients: [], loading: true, error: null });
    try {
      const clients = await clientService.getClients();
      setState({ clients, loading: false, error: null });
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al cargar clientes';
      setState({ clients: [], loading: false, error: message });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { ...state, refetch: fetchClients };
};
