import React from 'react';
import { NavLink } from 'react-router-dom';
import { TicketIcon, Users, Building2, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: TicketIcon },
  { to: '/tickets', label: 'Tickets', icon: TicketIcon },
  { to: '/users', label: 'Usuarios', icon: Users },
  { to: '/clients', label: 'Clientes', icon: Building2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between md:justify-start">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-gray-200 rounded-lg"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
