import { httpClient } from '../../../services/http';

import type { User, ClientTier } from '../../../types/index';

export type Company = {
  id: string;
  name: string;
  rut: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  tier?: ClientTier;
  isActive?: boolean;
  responsables: User[];
  responsibleUserIds?: string[]; // For create/update requests
}

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  totalPages?: number;
};

export const companyService = {
  async getCompanies(offset: number = 0, limit: number = 10): Promise<PaginatedResponse<Company>> {
    const { data } = await httpClient.get<PaginatedResponse<Company>>('/companies', {
      params: { offset, limit },
    });
    // Return full paginated envelope
    return data;
  },
  async createCompany(payload: Partial<Company>): Promise<Company> {
    const { data } = await httpClient.post<Company>('/companies', payload);
    return data;
  },
  async updateCompany(id: string, payload: Partial<Company>): Promise<Company> {
    const { data } = await httpClient.patch<Company>(`/companies/${id}`, payload);
    return data;
  },
  async deleteCompany(id: string): Promise<void> {
    await httpClient.delete(`/companies/${id}`);
  },
};
