import type { Comment, CreateCommentPayload, UpdateCommentPayload } from '../../../types/index';
import { httpClient } from '../../../services/http';

export const commentService = {
  async getComments(ticketId: string): Promise<Comment[]> {
    const { data } = await httpClient.get<Comment[]>('/comments', {
      params: { ticketId },
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
