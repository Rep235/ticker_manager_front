import { useState } from 'react';
import { setupService } from '../services/setupService';
import type { BootstrapAdminPayload, BootstrapAdminResponse } from '../../../types';

interface BootstrapState {
  loading: boolean;
  error: string | null;
}

export const useBootstrapAdmin = () => {
  const [state, setState] = useState<BootstrapState>({ loading: false, error: null });

  const createAdmin = async (payload: BootstrapAdminPayload): Promise<BootstrapAdminResponse | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await setupService.createAdmin(payload);
      setState({ loading: false, error: null });
      return result;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        'No se pudo crear el administrador';
      setState({ loading: false, error: message });
      return null;
    }
  };

  return { ...state, createAdmin };
};
