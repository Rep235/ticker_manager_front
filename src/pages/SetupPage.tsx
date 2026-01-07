import React, { useMemo, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useBootstrapAdmin, useSetupStatus } from '../features/setup';
import { useLogin } from '../features/auth';
import { LoadingState, ErrorState } from '../components/common';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { needsAdmin, loading: statusLoading, error: statusError } = useSetupStatus();
  const { createAdmin, loading: creating, error: createError } = useBootstrapAdmin();
  const { login, loading: loginLoading, error: loginError } = useLogin();

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const isLoading = useMemo(() => statusLoading || creating || loginLoading, [statusLoading, creating, loginLoading]);

  if (statusLoading) {
    return <LoadingState message="Verificando configuración inicial..." />;
  }

  if (statusError) {
    return <ErrorState message={statusError} />;
  }

  if (!needsAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (!form.username || !form.firstName || !form.lastName || !form.email || !form.password) {
      setLocalError('Completa todos los campos requeridos');
      return;
    }

    const created = await createAdmin({
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      companyName: form.companyName,
    });

    if (!created) return;

    setSuccess(true);

    const logged = await login({ email: form.email, password: form.password });
    if (logged) {
      navigate('/dashboard');
    }
  };

  const aggregatedError = localError || createError || loginError;

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader
            title="Configura tu administrador"
            description="Primera vez: crea la cuenta administradora para comenzar."
          />
          <CardBody className="space-y-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-sm text-[var(--muted)]">
              <p>Usa estas credenciales solo para la creación inicial. Podrás añadir más usuarios después.</p>
            </div>

            {aggregatedError && <Alert type="error" message={aggregatedError} />}
            {success && <Alert type="success" message="Administrador creado. Iniciando sesión..." />}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Usuario"
                  value={form.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                />
                <Input
                  label="Nombre"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
                <Input
                  label="Apellido"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>

              <Input
                label="Correo administrador"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />

              <Input
                label="Empresa (opcional)"
                value={form.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />

              <CardFooter>
                <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full md:w-auto">
                  Crear administrador y continuar
                </Button>
              </CardFooter>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SetupPage;
