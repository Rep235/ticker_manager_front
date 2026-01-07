import { useEffect, useState, useCallback } from 'react';
import { setupService } from '../services/setupService';
import type { SetupStatus } from '../../../types';

interface SetupState extends SetupStatus {
  loading: boolean;
  error: string | null;
}

const initialState: SetupState = {
  needsAdmin: false,
  hasUsers: false,
  message: undefined,
  loading: true,
  error: null,
};

export const useSetupStatus = () => {
  const [state, setState] = useState<SetupState>(initialState);

  const fetchStatus = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const status = await setupService.getStatus();
      setState({ ...status, loading: false, error: null });
    } catch (error: unknown) {
      const axiosError = error as any;
      const message =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        'No se pudo verificar el estado de configuración inicial';
      setState((prev) => ({ ...prev, loading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { ...state, refresh: fetchStatus };
};
