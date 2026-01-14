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
  { to: '/companies', label: 'Compañías', icon: Building2 },
  { to: '/companies/create', label: 'Nueva Compañía', icon: Building2, adminOnly: true },
  { to: '/settings', label: 'Preferencias', icon: Settings },
  { to: '/about', label: 'Acerca de', icon: Building2 },
];

import { useAuth } from '../../features/auth';

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { token } = useAuth();
  let userRole: string | undefined = undefined;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    }
  } catch {}

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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[var(--surface)] border-r border-[var(--border)] transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 flex items-center justify-between md:justify-start border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text)]">Menu</h2>
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-[var(--surface-muted)] rounded-lg"
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navItems
              .filter(item => !item.adminOnly || userRole === 'ADMIN')
              .map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-100)] text-[var(--accent-700)] font-medium'
                        : 'text-[var(--muted)] hover:bg-[var(--surface-muted)]'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
          </nav>

          {/* Footer */}
          {/* Footer removed: settings now in navItems */}
        </div>
      </aside>
    </>
  );
};
