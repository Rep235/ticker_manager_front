import { useState } from 'react';
import { useCompanies } from '../features/companies/hooks/useCompanies';
import { companyService } from '../features/companies/services/companyService';
import type { Company } from '../features/companies/services/companyService';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';

export default function CompaniesPage() {
  const { companies, loading, error, refetch, page, totalPages, total, nextPage, prevPage } = useCompanies({ initialPageSize: 10 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Company>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await refetch();
    } catch (err: any) {
      setFormError(err?.message || 'Error al crear compañía');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrado por nombre
  const filteredCompanies = Array.isArray(companies)
    ? companies.filter((company: Company) =>
        company.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Estado global para edición inline
  const [inlineEdit, setInlineEdit] = useState<{
    companyId: string | null;
    field: string | null;
    value: string;
    submitting: boolean;
    error: string | null;
  }>({ companyId: null, field: null, value: '', submitting: false, error: null });

  // Toggle para habilitar edición
  const [editMode, setEditMode] = useState(false);

  const startInlineEdit = (companyId: string, field: string, value: string) => {
    setInlineEdit({ companyId, field, value, submitting: false, error: null });
  };

  const cancelInlineEdit = () => {
    setInlineEdit({ companyId: null, field: null, value: '', submitting: false, error: null });
  };

  const saveInlineEdit = async () => {
    setInlineEdit(prev => ({ ...prev, submitting: true, error: null }));
    try {
      const payload: any = {};
      if (inlineEdit.field === 'responsibleUserIds') {
        payload.responsibleUserIds = inlineEdit.value.split(',').map((id: string) => id.trim()).filter(Boolean);
      } else if (inlineEdit.field) {
        payload[inlineEdit.field] = inlineEdit.value;
      }
      await companyService.updateCompany(inlineEdit.companyId!, payload);
      await refetch();
      cancelInlineEdit();
    } catch (err: any) {
      setInlineEdit(prev => ({ ...prev, error: err?.message || 'Error al actualizar', submitting: false }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Compañías</h1>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} className="accent-blue-600" />
            <span className="text-sm">Habilitar edición</span>
          </label>
          <Button onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancelar' : 'Nueva Compañía'}</Button>
        </div>
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
            <Input name="rut" label="RUT" value={form.rut || ''} onChange={handleInput} required />
            <Input name="email" label="Email" value={form.email || ''} onChange={handleInput} />
            <Input name="phone" label="Teléfono" value={form.phone || ''} onChange={handleInput} />
            <Input name="address" label="Dirección" value={form.address || ''} onChange={handleInput} />
            <Input name="description" label="Descripción" value={form.description || ''} onChange={handleInput} />
            <Select
              name="tier"
              label="Tier de compañía"
              value={(form as any).tier || ''}
              onChange={handleInput}
              options={[
                { value: 'FREE', label: 'FREE' },
                { value: 'BASIC', label: 'BASIC' },
                { value: 'PREMIUM', label: 'PREMIUM' },
                { value: 'ENTERPRISE', label: 'ENTERPRISE' },
              ]}
              required
            />
            <Input name="responsibleUserIds" label="ID de Responsables (separados por coma)" value={Array.isArray(form.responsibleUserIds) ? form.responsibleUserIds.join(', ') : ''} onChange={(e) => setForm({ ...form, responsibleUserIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean) })} placeholder="uuid-1, uuid-2" />
            {formError && <Alert type="error" message={formError} />}
            <Button type="submit" isLoading={submitting}>Crear</Button>
          </form>
        </Card>
      )}
      {loading ? (
        <div>Cargando compañías...</div>
      ) : error ? (
        <Alert type="error" message={error || ''} />
      ) : (
        <div className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <div className="text-gray-500">No hay compañías registradas.</div>
          ) : (
            filteredCompanies.map((company: Company) => (
              <Card key={company.id} className="flex flex-col md:flex-row md:items-center md:justify-between p-4">
                <div>
                  <div className="font-semibold text-lg">
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'name' ? (
                      <div className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </div>
                    ) : (
                      <span>{company.name} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'name', company.name)}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">RUT:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'rut' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      <span> {company.rut} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'rut', company.rut)}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'email' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      <span> {company.email} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'email', company.email || '')}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'phone' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      <span> {company.phone} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'phone', company.phone || '')}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Dirección:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'address' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      <span> {company.address} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'address', company.address || '')}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Descripción:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'description' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      <span> {company.description} {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'description', company.description || '')}>Editar</Button>}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Responsables:</span>
                    {inlineEdit.companyId === company.id && inlineEdit.field === 'responsibleUserIds' ? (
                      <span className="flex gap-2 items-center">
                        <Input type="text" value={inlineEdit.value} onChange={e => setInlineEdit(prev => ({ ...prev, value: e.target.value }))} className="max-w-xs" placeholder="uuid-1, uuid-2" />
                        <Button size="sm" onClick={saveInlineEdit} isLoading={inlineEdit.submitting}>Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={cancelInlineEdit}>Cancelar</Button>
                      </span>
                    ) : (
                      company.responsables && company.responsables.length > 0 ? (
                        <span>
                          <ul className="list-disc ml-4 inline-block">
                            {company.responsables.map((resp, idx) => (
                              <li key={resp.id || idx}>{resp.email || resp.username}</li>
                            ))}
                          </ul>
                          {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'responsibleUserIds', company.responsables.map(r => r.id).join(', '))}>Editar</Button>}
                        </span>
                      ) : (
                        <span>
                          <span className="ml-2 text-gray-400">Sin responsables</span>
                          {editMode && <Button size="sm" variant="ghost" onClick={() => startInlineEdit(company.id, 'responsibleUserIds', '')}>Editar</Button>}
                        </span>
                      )
                    )}
                  </div>
                  {inlineEdit.companyId === company.id && inlineEdit.error && <Alert type="error" message={inlineEdit.error} />}
                </div>
                {/* <div className="flex gap-2 mt-2 md:mt-0">
                  <Button variant="destructive" size="sm">Eliminar</Button>
                </div> */}
              </Card>
            ))
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={prevPage} disabled={page <= 1}>Anterior</Button>
              <span className="text-sm">Página {page} de {Math.max(1, totalPages || 1)}</span>
              <Button size="sm" onClick={nextPage} disabled={totalPages ? page >= totalPages : false}>Siguiente</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
