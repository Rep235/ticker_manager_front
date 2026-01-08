import { httpClient } from '../../../services/http';

export type Company = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
}

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    const { data } = await httpClient.get<Company[]>('/companies');
    return data;
  },
  async createCompany(payload: Partial<Company>): Promise<Company> {
    const { data } = await httpClient.post<Company>('/companies', payload);
    return data;
  },
};
