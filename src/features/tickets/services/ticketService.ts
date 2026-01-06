import type { Ticket, CreateTicketPayload, UpdateTicketPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';

export const ticketService = {
  async getTickets(): Promise<Ticket[]> {
    const { data } = await httpClient.get<Ticket[]>('/tickets');
    return data;
  },

  async getTicketById(id: string): Promise<Ticket> {
    const { data } = await httpClient.get<Ticket>(`/tickets/${id}`);
    return data;
  },

  async createTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const { data } = await httpClient.post<Ticket>('/tickets', payload);
    return data;
  },

  async updateTicket(id: string, payload: UpdateTicketPayload): Promise<Ticket> {
    const { data } = await httpClient.put<Ticket>(`/tickets/${id}`, payload);
    return data;
  },

  async deleteTicket(id: string): Promise<void> {
    await httpClient.delete(`/tickets/${id}`);
  },
};
