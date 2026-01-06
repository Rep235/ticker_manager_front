import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../features/auth';
import { Button, Input, Card, Alert } from '../components/ui';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, register } = useRegister();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const result = await register(formData);
    if (result) {
      navigate('/dashboard');
    } else if (error) {
      setLocalError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">Crea tu cuenta</h1>
            <p className="text-sm text-gray-600">Regístrate en Ticket Manager</p>
          </div>

          {localError && <Alert type="error" message={localError} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de usuario"
              name="username"
              placeholder="tu_usuario"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Nombre"
              name="firstName"
              placeholder="Juan"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Apellido"
              name="lastName"
              placeholder="Pérez"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Min. 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Crear cuenta
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
