import React from 'react';
import { useAuth } from '../../features/auth';
import { usePreferences } from '../../features/preferences';
import { Button } from '../ui/Button';
import { Menu, LogOut } from 'lucide-react';
import { ThemeControls } from './ThemeControls';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { logout } = useAuth();
  const { logoUrl } = usePreferences();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-[var(--surface-muted)] rounded-lg"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          )}
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain bg-[var(--surface-muted)] border border-[var(--border)]" />
          ) : (
            <span className="text-xl font-semibold text-[var(--text)]">Ticket Manager</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ThemeControls />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
};
