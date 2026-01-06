import { useTickets } from '../features/tickets';
import { useClients } from '../features/clients';
import { useUsers } from '../features/users';
import { LoadingState, ErrorState, EmptyState } from '../components/common/States';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { TrendingUp, Users, Building2, AlertCircle } from 'lucide-react';
import type { Ticket } from '../types';

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Card className="space-y-2">
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </Card>
);

const RecentTicketsWidget: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  const recent = tickets.slice(0, 5);

  if (recent.length === 0) {
    return <EmptyState message="No hay tickets recientes" />;
  }

  return (
    <div className="space-y-2">
      {recent.map((ticket) => (
        <div
          key={ticket.id}
          className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{ticket.title}</p>
              <p className="text-xs text-gray-600 mt-1">{ticket.description}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                ticket.priority === 'CRITICAL'
                  ? 'bg-red-100 text-red-700'
                  : ticket.priority === 'HIGH'
                    ? 'bg-orange-100 text-orange-700'
                    : ticket.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
              }`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets();
  const { clients, loading: clientsLoading } = useClients();
  const { users, loading: usersLoading } = useUsers();

  const openTickets = tickets.filter(
    (t) =>
      t.status !== 'CLOSED' &&
      t.status !== 'RESOLVED' &&
      t.status !== 'CANCELLED'
  ).length;

  if (ticketsLoading || clientsLoading || usersLoading) {
    return <LoadingState message="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Bienvenido de vuelta. Aquí está tu resumen.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<AlertCircle className="text-blue-600" size={24} />}
          label="Tickets Abiertos"
          value={openTickets}
          color="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="text-green-600" size={24} />}
          label="Total de Tickets"
          value={tickets.length}
          color="bg-green-50"
        />
        <StatCard
          icon={<Users className="text-purple-600" size={24} />}
          label="Usuarios"
          value={users.length}
          color="bg-purple-50"
        />
        <StatCard
          icon={<Building2 className="text-orange-600" size={24} />}
          label="Clientes"
          value={clients.length}
          color="bg-orange-50"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Tickets Recientes"
              description="Tus últimos 5 tickets creados"
            />
            <CardBody>
              {ticketsError ? (
                <ErrorState message={ticketsError} />
              ) : (
                <RecentTicketsWidget tickets={tickets} />
              )}
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader title="Estado General" description="Resumen rápido" />
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Resolución promedio</p>
                <p className="text-lg font-semibold text-gray-900">--</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Satisfacción</p>
                <p className="text-lg font-semibold text-gray-900">--</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agentes activos</p>
                <p className="text-lg font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
