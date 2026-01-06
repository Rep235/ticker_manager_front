import { useState } from 'react';
import type { Client, CreateClientPayload } from '../../../types/index';
import { clientService } from '../services/clientService';

interface UseCreateClientState {
  loading: boolean;
  error: string | null;
}

export const useCreateClient = () => {
  const [state, setState] = useState<UseCreateClientState>({
    loading: false,
    error: null,
  });

  const createClient = async (payload: CreateClientPayload): Promise<Client | null> => {
    setState({ loading: true, error: null });
    try {
      const client = await clientService.createClient(payload);
      setState({ loading: false, error: null });
      return client;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al crear cliente';
      setState({ loading: false, error: message });
      return null;
    }
  };

  return { ...state, createClient };
};
