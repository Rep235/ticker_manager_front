import { useState, useEffect, useCallback } from 'react';
import type { Ticket } from '../../../types/index';
import { ticketService, type PaginatedResponse } from '../services/ticketService';
import { getErrorMessage } from '../../../lib/errorHandler';

interface UseTicketsOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseTicketsState extends UseTicketsOptions {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

export const useTickets = (options: UseTicketsOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState<UseTicketsState>({
    tickets: [],
    loading: true,
    error: null,
    total: 0,
    totalPages: 0,
    initialPage,
    initialPageSize,
  });

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const fetchTickets = useCallback(async () => {
    setState((prev) => ({ ...prev, tickets: [], loading: true, error: null }));
    try {
      const offset = (page - 1) * pageSize;
      const result: PaginatedResponse<Ticket> = await ticketService.getTickets(offset, pageSize);
      setState((prev) => ({
        ...prev,
        tickets: result.data,
        loading: false,
        error: null,
        total: result.total,
        totalPages: result.totalPages ?? Math.ceil(result.total / result.limit),
      }));
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setState((prev) => ({ ...prev, tickets: [], loading: false, error: message }));
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(Math.max(1, p));

  return {
    tickets: state.tickets,
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
    refetch: fetchTickets,
  };
};
