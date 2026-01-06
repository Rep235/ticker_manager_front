import { useState, useEffect } from 'react';
import type { Ticket } from '../../../types/index';
import { ticketService } from '../services/ticketService';
import { getErrorMessage } from '../../../lib/errorHandler';

interface UseTicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

export const useTickets = () => {
  const [state, setState] = useState<UseTicketsState>({
    tickets: [],
    loading: false,
    error: null,
  });

  const fetchTickets = async () => {
    setState({ tickets: [], loading: true, error: null });
    try {
      const tickets = await ticketService.getTickets();
      setState({ tickets, loading: false, error: null });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setState({ tickets: [], loading: false, error: message });
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { ...state, refetch: fetchTickets };
};
