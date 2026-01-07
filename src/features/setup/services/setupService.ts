import type { BootstrapAdminPayload, BootstrapAdminResponse, SetupStatus } from '../../../types';
import { httpClient } from '../../../services/http';

export const setupService = {
  async getStatus(): Promise<SetupStatus & { defaultCompanyId?: string }> {
    const { data } = await httpClient.get<SetupStatus & { defaultCompanyId?: string }>('/setup/status');
    return data;
  },

  async createAdmin(payload: BootstrapAdminPayload): Promise<BootstrapAdminResponse> {
    const { data } = await httpClient.post<BootstrapAdminResponse>('/setup/admin', payload);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('companyId', data.companyId);
    }
    return data;
  },
};
