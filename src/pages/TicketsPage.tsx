import React, { useState } from 'react';
import { useTickets } from '../features/tickets';
import { Button, Card, CardBody, Select } from '../components/ui';
import { LoadingState, ErrorState, EmptyState, Breadcrumbs } from '../components/common';
import { Plus, Search, Filter } from 'lucide-react';
import type { TicketStatus, TicketPriority } from '../types';
import { Link } from 'react-router-dom';

const TicketsPage: React.FC = () => {
  const { tickets, loading, error, refetch } = useTickets();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

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
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {/* Empty State */}
      {!error && filteredTickets.length === 0 && (
        <EmptyState message="No hay tickets que coincidan con tus filtros" />
      )}

      {/* Tickets List */}
      {!error && filteredTickets.length > 0 && (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    {ticket.dueDate && (
                      <div>
                        Vencimiento: <span className="font-medium">{new Date(ticket.dueDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {!error && filteredTickets.length > 0 && (
        <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
          Mostrando <strong>{filteredTickets.length}</strong> de <strong>{tickets.length}</strong> tickets
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
