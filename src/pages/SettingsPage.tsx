import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { usePreferences } from '../features/preferences';
import type { AccentColor, ThemeMode } from '../features/preferences';
import { Alert } from '../components/ui/Alert';

const accentOptions = [
  { value: 'blue', label: 'Azul' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'amber', label: 'Ámbar' },
];

const modeOptions = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

const SettingsPage: React.FC = () => {
  const { mode, accent, logoUrl, setMode, setAccent, setLogoUrl, reset } = usePreferences();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoUrl(result);
    };
    reader.onerror = () => setError('No se pudo leer la imagen');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Preferencias</h1>
        <p className="text-sm text-[var(--muted)]">Personaliza la apariencia y el branding del sistema.</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <Card>
        <CardHeader title="Tema" description="Elige modo y acento de color" />
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text)]">Modo</label>
            <Select
              aria-label="Seleccionar modo de tema"
              value={mode}
              onChange={(e) => setMode(e.target.value as ThemeMode)}
              options={modeOptions}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text)]">Acento</label>
            <Select
              aria-label="Seleccionar color de acento"
              value={accent}
              onChange={(e) => setAccent(e.target.value as AccentColor)}
              options={accentOptions}
            />
          </div>
        </CardBody>
        <CardFooter>
          <Button variant="secondary" onClick={reset}>Restablecer</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Logo de la empresa" description="El logo se mostrará en la barra de navegación" />
        <CardBody className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-sm text-[var(--muted)]">Sin logo</span>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                aria-label="Subir logo"
              />
              <p className="text-xs text-[var(--muted)]">Formatos permitidos: PNG, JPG, SVG. Máx 2MB.</p>
            </div>
          </div>
          {logoUrl && (
            <Button variant="ghost" size="sm" onClick={() => setLogoUrl(null)}>
              Quitar logo
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
