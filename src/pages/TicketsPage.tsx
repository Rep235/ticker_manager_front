import React, { useState } from 'react';
import { useTickets } from '../features/tickets';
import { Button, Card, CardBody, Select, Input, Alert } from '../components/ui';
import { LoadingState, ErrorState, EmptyState, Breadcrumbs } from '../components/common';
import { Plus, Search, Filter } from 'lucide-react';
import type { TicketStatus, TicketPriority, CreateTicketPayload } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../features/tickets/services';
import { getUserIdFromToken } from '../lib/jwt';

const TicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const { tickets, loading, error, refetch, page, totalPages, total, nextPage, prevPage } = useTickets({ initialPageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '' as TicketPriority | '',
    dueDate: '',
    tags: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!form.title.trim() || !form.description.trim()) {
      setCreateError('Título y descripción son obligatorios.');
      return;
    }
    const userId = getUserIdFromToken();
    if (!userId) {
      setCreateError('No se pudo determinar el usuario actual. Inicia sesión nuevamente.');
      return;
    }
    setIsCreating(true);
    try {
      const payload: CreateTicketPayload = {
        clientId: userId,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      };
      const created = await ticketService.createTicket(payload);
      navigate(`/tickets/${created.id}`);
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || err?.message || 'Error al crear el ticket');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTickets = Array.isArray(tickets)
    ? tickets.filter((ticket) => {
        const matchesStatus = !statusFilter || ticket.status === statusFilter;
        const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
        const matchesSearch =
          !searchTerm ||
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
      })
    : [];
    // ...existing code...

  const statusOptions = [
    { value: 'OPEN', label: 'Abierto' },
    { value: 'IN_PROGRESS', label: 'En progreso' },
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

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700';
      case 'WAITING_ON_AGENT':
        return 'bg-orange-100 text-orange-700';
      case 'RESOLVED':
        return 'bg-green-100 text-green-700';
      case 'CLOSED':
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <LoadingState message="Cargando tickets..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs items={[{ label: 'Tickets' }]} />
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">Gestionar Tickets</h1>
        <p className="text-sm text-gray-600 mt-1">
          Visualiza y gestiona todos tus tickets de soporte.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <Select
          label="Estado"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target.value as TicketStatus) || '')}
        />

        <Select
          label="Prioridad"
          options={priorityOptions}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter((e.target.value as TicketPriority) || '')}
        />

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={refetch}>
            <Filter size={16} className="mr-2" />
            Actualizar
          </Button>
          <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
            <Plus size={16} className="mr-2" />
            {showCreate ? 'Cerrar' : 'Nuevo'}
          </Button>
        </div>
      </div>

      {showCreate && (
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Crear Ticket</h2>

            {createError && (
              <Alert type="error" message={createError} onClose={() => setCreateError(null)} />
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Título"
                placeholder="Breve título descriptivo"
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  placeholder="Describe el problema o solicitud con el mayor detalle posible"
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Prioridad"
                  options={[
                    { value: 'LOW', label: 'Bajo' },
                    { value: 'MEDIUM', label: 'Medio' },
                    { value: 'HIGH', label: 'Alto' },
                    { value: 'CRITICAL', label: 'Crítico' },
                  ]}
                  value={form.priority}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, priority: (e.target.value as TicketPriority) || '' }))
                  }
                />

                <Input
                  label="Vencimiento (opcional)"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
                />

                <Input
                  label="Tags (opcional, separadas por coma)"
                  placeholder="mobile, ios, login"
                  value={form.tags}
                  onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isCreating}>
                  Crear
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {/* Empty State */}
      {!error && filteredTickets.length === 0 && (
        <EmptyState message="No hay tickets que coincidan con tus filtros" />
      )}

      {/* Tickets Table */}
      {!error && filteredTickets.length > 0 && (
        <Card>
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Prioridad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vencimiento</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 max-w-[360px]">
                      <div className="font-medium truncate">{ticket.title}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">{ticket.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString('es-ES') : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-700 font-medium">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Total: {total}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={prevPage} disabled={page <= 1}>Anterior</Button>
                <span className="text-sm">Página {page} de {Math.max(1, totalPages || 1)}</span>
                <Button size="sm" onClick={nextPage} disabled={totalPages ? page >= totalPages : false}>Siguiente</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default TicketsPage;
