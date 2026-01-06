import { useState } from 'react';
import type { Comment, CreateCommentPayload } from '../../../types/index';
import { commentService } from '../services/commentService';

interface UseCommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

export const useComments = (ticketId: string | undefined) => {
  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    loading: false,
    error: null,
  });

  const fetchComments = async () => {
    if (!ticketId) return;
    setState({ comments: [], loading: true, error: null });
    try {
      const comments = await commentService.getComments(ticketId);
      setState({ comments, loading: false, error: null });
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al cargar comentarios';
      setState({ comments: [], loading: false, error: message });
    }
  };

  const addComment = async (payload: CreateCommentPayload) => {
    try {
      const comment = await commentService.createComment(payload);
      setState((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
      return comment;
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al crear comentario';
      setState((prev) => ({ ...prev, error: message }));
      throw error;
    }
  };

  return { ...state, fetchComments, addComment };
};
