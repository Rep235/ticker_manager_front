import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import { companyService } from '../features/companies/services/companyService';
import { useAuth } from '../features/auth';

const CreateCompanyPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await companyService.createCompany(form);
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
