import { useState } from 'react';
import { useCompanies } from '../features/companies/hooks/useCompanies';
import { companyService } from '../features/companies/services/companyService';
import type { Company } from '../features/companies/services/companyService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export default function CompaniesPage() {
  const { companies, loading, error } = useCompanies();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Company>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  // const [refresh, setRefresh] = useState(0); // Eliminado porque no se usa

  // For edit/delete (future extension)
  // const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await companyService.createCompany(form);
      setShowForm(false);
      setForm({});
      setRefresh(r => r + 1); // trigger reload
    } catch (err: any) {
      setFormError(err?.message || 'Error al crear compañía');
    } finally {
      setSubmitting(false);
    }
  };

  // TODO: Implement edit/delete actions

  // Filtrado por nombre
  const filteredCompanies = companies?.filter((company: Company) =>
    company.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Compañías</h1>
        <Button onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancelar' : 'Nueva Compañía'}</Button>
      </div>
      <div className="mb-4">
        <Input
          name="search"
          label="Buscar por nombre"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar compañía..."
        />
      </div>
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input name="name" label="Nombre" value={form.name || ''} onChange={handleInput} required />
            <Input name="email" label="Email" value={form.email || ''} onChange={handleInput} />
            <Input name="phone" label="Teléfono" value={form.phone || ''} onChange={handleInput} />
            <Input name="address" label="Dirección" value={form.address || ''} onChange={handleInput} />
            <Input name="description" label="Descripción" value={form.description || ''} onChange={handleInput} />
            {formError && <Alert variant="destructive" title={formError} />}
            <Button type="submit" isLoading={submitting}>Crear</Button>
          </form>
        </Card>
      )}
      {loading ? (
        <div>Cargando compañías...</div>
      ) : error ? (
        <Alert variant="destructive" title={error || ''} />
      ) : (
        <div className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <div className="text-gray-500">No hay compañías registradas.</div>
          ) : (
            filteredCompanies.map((company: Company) => (
              <Card key={company.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                <div>
                  <div className="font-semibold text-lg">{company.name}</div>
                  <div className="text-sm text-gray-600">{company.email}</div>
                  <div className="text-sm text-gray-600">{company.phone}</div>
                  <div className="text-sm text-gray-600">{company.address}</div>
                  <div className="text-sm text-gray-600">{company.description}</div>
                </div>
                {/*
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="destructive" size="sm">Eliminar</Button>
                </div>
                */}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
