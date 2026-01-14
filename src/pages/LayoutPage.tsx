import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components/common';

const LayoutPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;
