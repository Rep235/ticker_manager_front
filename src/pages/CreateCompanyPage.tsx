import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../features/companies/services/companyService';
import type { ClientTier } from '../types';

type CreateCompanyForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  rut: string;
  responsibleUserIds: string; // comma-separated input
  tier: ClientTier | '';
  isActive: boolean;
};

const CreateCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateCompanyForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    rut: '',
    responsibleUserIds: '',
    tier: '',
    isActive: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const responsibleUserIds = form.responsibleUserIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      await companyService.createCompany({
        name: form.name,
        description: form.description,
        email: form.email,
        phone: form.phone,
        address: form.address,
        tier: form.tier || undefined,
        rut: form.rut,
        responsibleUserIds: responsibleUserIds.length ? responsibleUserIds : undefined,
        isActive: form.isActive,
      });
      setSuccess(true);
      setTimeout(() => navigate('/companies'), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error al crear la compañía');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader title="Crear Compañía" description="Solo administradores pueden crear compañías." />
        <CardBody>
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message="Compañía creada correctamente" />}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
            <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Dirección" name="address" value={form.address} onChange={handleChange} />
            <Input label="Descripción" name="description" value={form.description} onChange={handleChange} />
            <Input label="RUT" name="rut" value={form.rut} onChange={handleChange} required />
            <Input
              label="Responsables (UUIDs separados por coma)"
              name="responsibleUserIds"
              value={form.responsibleUserIds}
              onChange={handleChange}
              placeholder="uuid-1, uuid-2"
            />
            <Select
              label="Tier de compañía"
              name="tier"
              value={form.tier}
              onChange={handleChange}
              options={[
                { value: 'FREE', label: 'FREE' },
                { value: 'BASIC', label: 'BASIC' },
                { value: 'PREMIUM', label: 'PREMIUM' },
                { value: 'ENTERPRISE', label: 'ENTERPRISE' },
              ]}
              required
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="accent-blue-600"
              />
              Activa
            </label>
            <CardFooter>
              <Button type="submit" isLoading={loading} disabled={loading}>
                Crear Compañía
              </Button>
            </CardFooter>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateCompanyPage;
