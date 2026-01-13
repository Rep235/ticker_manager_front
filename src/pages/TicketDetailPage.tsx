import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketDetail, useComments } from '../features/tickets';
import { Button, Select, Card, CardHeader, CardBody, CardFooter, Alert } from '../components/ui';
import { LoadingState, ErrorState, Breadcrumbs } from '../components/common';
import { MessageSquare } from 'lucide-react';
import type { UpdateTicketPayload, TicketStatus } from '../types';
import { getUserIdFromToken } from '../lib/jwt';

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ticket, loading, error, updateTicket, deleteTicket } = useTicketDetail(id);
  const { comments, fetchComments, addComment, total, totalPages, page, nextPage, prevPage } = useComments(id, { initialPageSize: 20 });
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const [editData, setEditData] = useState<UpdateTicketPayload>({});

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id, fetchComments]);

  const handleEdit = (field: keyof UpdateTicketPayload, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateError(null);
      setIsSubmitting(true);
      await updateTicket(editData);
      setIsEditing(false);
      setEditData({});
    } catch (error: any) {
      setUpdateError(error.message || 'Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    const userId = getUserIdFromToken();
    if (!userId) {
      setUpdateError('No se pudo determinar el usuario actual para comentar.');
      return;
    }
    try {
      setUpdateError(null);
      setIsCommentSubmitting(true);
      await addComment({
        content: newComment.trim(),
        ticketId: id,
        authorId: userId,
        isInternal: false,
      });
      setNewComment('');
      await fetchComments();
    } catch (err: any) {
      setUpdateError(err?.response?.data?.message || err?.message || 'Error al agregar comentario');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
      try {
        await deleteTicket();
        navigate('/tickets');
      } catch (error: unknown) {
        const axiosError = error as any;
        setUpdateError(axiosError.message || 'Error al eliminar');
      }
    }
  };

  if (loading) {
    return <LoadingState message="Cargando ticket..." />;
  }

  if (error || !ticket) {
    return <ErrorState message={error || 'Ticket no encontrado'} />;
  }

  const statusOptions: Array<{ value: string; label: string }> = [
    { value: 'OPEN', label: 'Abierto' },
    { value: 'IN_PROGRESS', label: 'En progreso' },
    { value: 'WAITING_ON_CLIENT', label: 'Esperando cliente' },
    { value: 'WAITING_ON_AGENT', label: 'Esperando agente' },
    { value: 'RESOLVED', label: 'Resuelto' },
    { value: 'CLOSED', label: 'Cerrado' },
    { value: 'CANCELLED', label: 'Cancelado' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Bajo' },
    { value: 'MEDIUM', label: 'Medio' },
    { value: 'HIGH', label: 'Alto' },
    { value: 'CRITICAL', label: 'Crítico' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: 'Tickets', path: '/tickets' },
            { label: ticket.title },
          ]}
        />
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">{ticket.title}</h1>
      </div>

      {updateError && <Alert type="error" message={updateError} />}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Detalles" description="Información del ticket" />
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.description || ticket.description}
                    onChange={(e) => handleEdit('description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{ticket.description}</p>
                )}
              </div>

              {isEditing && (
                <>
                  <Select
                    label="Estado"
                    options={statusOptions}
                    value={editData.status || ticket.status}
                    onChange={(e) => handleEdit('status', e.target.value as TicketStatus)}
                  />

                  <Select
                    label="Prioridad"
                    options={priorityOptions}
                    value={editData.priority || ticket.priority}
                    onChange={(e) => handleEdit('priority', e.target.value)}
                  />
                </>
              )}
            </CardBody>

            <CardFooter>
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({});
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveChanges} isLoading={isSubmitting}>
                    Guardar cambios
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Eliminar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <Card className="mt-6">
            <CardHeader
              title={`Comentarios (${total})`}
              description="Historial de conversación"
            />
            <CardBody className="space-y-4">
              {comments.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <MessageSquare size={20} className="mr-2" />
                  <span>No hay comentarios aún</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(comment.createdAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                        {comment.isInternal && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Interno
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {total > 0 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">Total: {total}</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={prevPage} disabled={page <= 1}>Anterior</Button>
                    <span className="text-sm">Página {page} de {Math.max(1, totalPages || 1)}</span>
                    <Button size="sm" onClick={nextPage} disabled={totalPages ? page >= totalPages : false}>Siguiente</Button>
                  </div>
                </div>
              )}

              {/* New Comment Input */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <textarea
                  placeholder="Añade un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    isLoading={isCommentSubmitting}
                    disabled={!newComment.trim() || isCommentSubmitting}
                  >
                    Comentar
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader title="Estado" />
            <CardBody>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Estatus</p>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Prioridad</p>
                  <p className={`text-sm font-medium ${
                    ticket.priority === 'CRITICAL'
                      ? 'text-red-600'
                      : ticket.priority === 'HIGH'
                        ? 'text-orange-600'
                        : 'text-gray-900'
                  }`}>
                    {ticket.priority}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader title="Información" />
            <CardBody className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-600">Creado</p>
                <p className="font-medium text-gray-900">
                  {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              {ticket.dueDate && (
                <div>
                  <p className="text-xs text-gray-600">Vencimiento</p>
                  <p className="font-medium text-gray-900">
                    {new Date(ticket.dueDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
