import type { User } from '../../../types/index';
import { httpClient } from '../../../services/http';

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await httpClient.get<User[]>('/users');
    return data;
  },

  async getUserById(id: string): Promise<User> {
    const { data } = await httpClient.get<User>(`/users/${id}`);
    return data;
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const { data } = await httpClient.post<User>('/users', payload);
    return data;
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await httpClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  },
};
