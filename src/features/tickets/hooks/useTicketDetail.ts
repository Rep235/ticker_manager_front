import { useState, useEffect } from 'react';
import type { Ticket, UpdateTicketPayload } from '../../../types/index';
import { ticketService } from '../services/ticketService';
import { getErrorMessage } from '../../../lib/errorHandler';

interface UseTicketDetailState {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
}

export const useTicketDetail = (id: string | undefined) => {
  const [state, setState] = useState<UseTicketDetailState>({
    ticket: null,
    loading: false,
    error: null,
  });

  const fetchTicket = async () => {
    if (!id) return;
    setState({ ticket: null, loading: true, error: null });
    try {
      const ticket = await ticketService.getTicketById(id);
      setState({ ticket, loading: false, error: null });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setState({ ticket: null, loading: false, error: message });
    }
  };

  const updateTicket = async (payload: UpdateTicketPayload) => {
    if (!id) return;
    try {
      const updated = await ticketService.updateTicket(id, payload);
      setState({ ticket: updated, loading: false, error: null });
      return updated;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setState((prev) => ({ ...prev, error: message }));
      throw error;
    }
  };

  const deleteTicket = async () => {
    if (!id) return;
    try {
      await ticketService.deleteTicket(id);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setState((prev) => ({ ...prev, error: message }));
      throw error;
    }
  };

  const handleFetchTicket = async () => {
    if (id) {
      void fetchTicket();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    void handleFetchTicket();
  }, [id]);

  return { ...state, updateTicket, deleteTicket, refetch: fetchTicket };
};
