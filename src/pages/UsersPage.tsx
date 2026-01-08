import { useState } from 'react';
import { useUsers, useCreateUser } from '../features/users';
import { useCompanies } from '../features/companies/hooks/useCompanies';
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Alert, Select } from '../components/ui';
import { LoadingState, ErrorState, EmptyState, Breadcrumbs } from '../components/common';
import { Plus, Trash2 } from 'lucide-react';
import type { CreateUserPayload } from '../features/users/services/userService';

const UsersPage: React.FC = () => {
  const { users, loading, error, refetch } = useUsers();
  const [search, setSearch] = useState('');
  const { loading: creating, error: createError, createUser } = useCreateUser();
  const [showForm, setShowForm] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { companies, loading: loadingCompanies, error: errorCompanies } = useCompanies();
  const [formData, setFormData] = useState<CreateUserPayload>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.companyId
    ) {
      setLocalError('Por favor completa todos los campos, incluyendo la empresa');
      return;
    }

    const result = await createUser(formData);
    if (result) {
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        companyId: '',
      });
      setShowForm(false);
      refetch();
    } else if (createError) {
      setLocalError(createError);
    }
  };

  // Filtrado flexible por nombre, apellido o username
  const filteredUsers = users?.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.username.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    );
  }) || [];

  if (loading) {
    return <LoadingState message="Cargando usuarios..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Usuarios: Gestión manual' }]} />
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Usuarios: Gestión manual</h1>
          <p className="text-sm text-gray-600 mt-1">Administra los usuarios del sistema de forma manual</p>
          <div className="my-4 max-w-xs">
            <Input
              name="search"
              label="Buscar por nombre de usuario"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar usuario..."
            />
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}
      {localError && <Alert type="error" message={localError} />}
      {createError && <Alert type="error" message={createError} />}

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader title="Usuarios: Gestión manual" description="Añade, edita o elimina usuarios manualmente" />
          <div className="my-6">
            {/* Placeholder para el flujo de invitación por magic link */}
            <div className="rounded-md border border-dashed border-gray-300 p-6 text-center bg-gray-50">
              <div className="text-lg font-medium mb-2">Próximamente: Invitación por Magic Link</div>
              <div className="text-gray-600 text-sm mb-2">El operador podrá enviar un correo electrónico con un enlace mágico para que el usuario cree su cuenta personalizada.</div>
              <div className="inline-block px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-700">Componente en desarrollo</div>
            </div>
          </div>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre de usuario"
                  name="username"
                  placeholder="usuario_123"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Nombre"
                  name="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Correo"
                  name="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Mín. 8 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={creating}
                />
                <Select
                  label="Empresa"
                  name="companyId"
                  value={formData.companyId}
                  onChange={e => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                  options={companies.map(c => ({ value: c.id, label: c.name }))}
                  disabled={loadingCompanies}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={creating}>
                  Crear Usuario
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Users Table */}
      {!error && filteredUsers.length === 0 && (
        <EmptyState message="No hay usuarios en el sistema" />
      )}

      {!error && filteredUsers.length > 0 && (
        <Card>
          <CardBody className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.username}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
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

export default UsersPage;
