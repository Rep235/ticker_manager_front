import { useState, useCallback, useRef, useEffect } from 'react';
import type { Comment, CreateCommentPayload } from '../../../types/index';
import { commentService, type PaginatedResponse } from '../services/commentService';
import { isUuid } from '../../../lib/jwt';

interface UseCommentsOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseCommentsState extends UseCommentsOptions {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
}

export const useComments = (ticketId: string | undefined, options: UseCommentsOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [state, setState] = useState<UseCommentsState>({
    comments: [],
    loading: false,
    error: null,
    total: 0,
    totalPages: 0,
    initialPage,
    initialPageSize,
  });
  const inFlightRef = useRef(false);
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const fetchComments = useCallback(async () => {
    if (!ticketId || inFlightRef.current) return;
    if (!isUuid(ticketId)) {
      setState((prev) => ({ ...prev, comments: [], loading: false, error: 'ticketId inválido' }));
      return;
    }
    inFlightRef.current = true;
    setState((prev) => ({ ...prev, comments: [], loading: true, error: null }));
    try {
      const offset = (page - 1) * pageSize;
      const result: PaginatedResponse<Comment> = await commentService.getComments(ticketId, offset, pageSize);
      setState((prev) => ({
        ...prev,
        comments: result.data,
        loading: false,
        error: null,
        total: result.total,
        totalPages: result.totalPages ?? Math.ceil(result.total / result.limit),
      }));
    } catch (error: unknown) {
      const axiosError = error as any;
      const message = axiosError.response?.data?.message || axiosError.message || 'Error al cargar comentarios';
      setState((prev) => ({ ...prev, comments: [], loading: false, error: message }));
    } finally {
      inFlightRef.current = false;
    }
  }, [ticketId, page, pageSize]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (payload: CreateCommentPayload) => {
    try {
      if (!ticketId) throw new Error('ticketId inválido');
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

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p: number) => setPage(Math.max(1, p));

  return {
    comments: state.comments,
    loading: state.loading,
    error: state.error,
    total: state.total,
    totalPages: state.totalPages,
    page,
    pageSize,
    setPageSize,
    nextPage,
    prevPage,
    goToPage,
    fetchComments,
    addComment,
  };
};
