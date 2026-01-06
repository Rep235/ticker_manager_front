import { useState } from 'react';
import { useClients, useCreateClient } from '../features/clients';
import { Button, Input, Select, Card, CardHeader, CardBody, CardFooter, Alert } from '../components/ui';
import { LoadingState, ErrorState, EmptyState, Breadcrumbs } from '../components/common';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateClientPayload } from '../types';
import type { ClientTier } from '../types';

const ClientsPage: React.FC = () => {
  const { clients, loading, error, refetch } = useClients();
  const { loading: creating, error: createError, createClient } = useCreateClient();
  const [showForm, setShowForm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateClientPayload>({
    name: '',
    email: '',
    phone: '',
    company: '',
    tier: 'FREE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.name || !formData.email) {
      setLocalError('Nombre y email son requeridos');
      return;
    }

    const result = await createClient(formData);
    if (result) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        tier: 'FREE',
      });
      setShowForm(false);
      refetch();
    } else if (createError) {
      setLocalError(createError);
    }
  };

  const tierOptions = [
    { value: 'FREE', label: 'Gratuito' },
    { value: 'BASIC', label: 'Básico' },
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'ENTERPRISE', label: 'Empresa' },
  ];

  const getTierColor = (tier: ClientTier) => {
    switch (tier) {
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-700';
      case 'PREMIUM':
        return 'bg-blue-100 text-blue-700';
      case 'BASIC':
        return 'bg-yellow-100 text-yellow-700';
      case 'FREE':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <LoadingState message="Cargando clientes..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Clientes' }]} />
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Gestionar Clientes</h1>
          <p className="text-sm text-gray-600 mt-1">Administra los clientes de tu sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}
      {localError && <Alert type="error" message={localError} />}
      {createError && <Alert type="error" message={createError} />}

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader title="Crear Cliente" description="Añade un nuevo cliente al sistema" />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="name"
                  placeholder="Nombre del cliente"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="cliente@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Teléfono"
                  name="phone"
                  placeholder="+1234567890"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Empresa"
                  name="company"
                  placeholder="Nombre de la empresa"
                  value={formData.company || ''}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Select
                  label="Plan"
                  name="tier"
                  options={tierOptions}
                  value={formData.tier || 'FREE'}
                  onChange={handleChange}
                />
              </div>
            </form>
          </CardBody>
          <CardFooter>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} isLoading={creating}>
              Crear Cliente
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Clients Table */}
      {!error && clients.length === 0 && (
        <EmptyState message="No hay clientes en el sistema" />
      )}

      {!error && clients.length > 0 && (
        <Card>
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Teléfono</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{client.name}</td>
                    <td className="py-3 px-4 text-gray-600">{client.email}</td>
                    <td className="py-3 px-4 text-gray-600">{client.phone || '--'}</td>
                    <td className="py-3 px-4 text-gray-600">{client.company || '--'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTierColor(client.tier)}`}>
                        {client.tier}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          client.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {client.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ClientsPage;
