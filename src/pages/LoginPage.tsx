import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from '../features/auth';
import { Button, Input, Card, Alert } from '../components/ui';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, login } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Por favor completa todos los campos');
      return;
    }

    const result = await login({ email, password });
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
            <h1 className="text-2xl font-semibold text-gray-900">Ticket Manager</h1>
            <p className="text-sm text-gray-600">Inicia sesión en tu cuenta</p>
          </div>

          {localError && <Alert type="error" message={localError} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Inicia sesión
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
