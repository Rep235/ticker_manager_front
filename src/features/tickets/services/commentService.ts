import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  totalPages?: number;
};

export const commentService = {
  async getComments(ticketId: string, offset: number = 0, limit: number = 10): Promise<PaginatedResponse<Comment>> {
    const { data } = await httpClient.get<PaginatedResponse<Comment>>('/comments', {
      params: { ticketId, offset, limit },
    });
    return data;
  },

  async getCommentById(id: string): Promise<Comment> {
    const { data } = await httpClient.get<Comment>(`/comments/${id}`);
    return data;
  },

  async createComment(payload: CreateCommentPayload): Promise<Comment> {
    const { data } = await httpClient.post<Comment>('/comments', payload);
    return data;
  },

  async updateComment(id: string, payload: UpdateCommentPayload): Promise<Comment> {
    const { data } = await httpClient.put<Comment>(`/comments/${id}`, payload);
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    await httpClient.delete(`/comments/${id}`);
  },
};
