import React from 'react';
import { useAuth } from '../../features/auth';
import { Button } from '../ui/Button';
import { Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">Ticket Manager</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
};
