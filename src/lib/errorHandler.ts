import type { AxiosError } from 'axios';
import type { ApiError } from '../types/index';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response?.data?.message) {
      const message = axiosError.response.data.message;
      return Array.isArray(message) ? message[0] : message;
    }
    return axiosError.message;
  }
  return 'Error desconocido';
};
