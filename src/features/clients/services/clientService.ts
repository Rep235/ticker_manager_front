import type { Client, CreateClientPayload, UpdateClientPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';

export const clientService = {
  async getClients(): Promise<Client[]> {
    const { data } = await httpClient.get<Client[]>('/clients');
    return data;
  },

  async getClientById(id: string): Promise<Client> {
    const { data } = await httpClient.get<Client>(`/clients/${id}`);
    return data;
  },

  async createClient(payload: CreateClientPayload): Promise<Client> {
    const { data } = await httpClient.post<Client>('/clients', payload);
    return data;
  },

  async updateClient(id: string, payload: UpdateClientPayload): Promise<Client> {
    const { data } = await httpClient.put<Client>(`/clients/${id}`, payload);
    return data;
  },

  async deleteClient(id: string): Promise<void> {
    await httpClient.delete(`/clients/${id}`);
  },
};
