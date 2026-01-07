import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { usePreferences } from '../../features/preferences';
import type { AccentColor } from '../../features/preferences';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

const accentOptions: { value: AccentColor; label: string }[] = [
  { value: 'blue', label: 'Azul' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'amber', label: 'Ámbar' },
];

export const ThemeControls: React.FC = () => {
  const { mode, accent, setMode, setAccent } = usePreferences();
  const isDark = mode === 'dark';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
      <div className="w-32">
        <Select
          aria-label="Seleccionar acento de color"
          value={accent}
          onChange={(e) => setAccent(e.target.value as AccentColor)}
          options={accentOptions}
        />
      </div>
      <Palette size={16} className="text-[var(--muted)]" aria-hidden />
    </div>
  );
};
