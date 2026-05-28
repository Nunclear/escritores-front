import React from 'react';
import { PrivateSidebar } from './PrivateSidebar';
import { TopBar } from './TopBar';

export function AppShell({
  children,
  user,
  userRole = 'USER',
  onLogout,
  sidebarOpen = true,
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <PrivateSidebar userRole={userRole} isOpen={sidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar */}
        <TopBar user={user} onLogout={onLogout} />

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer - optional */}
        <footer className="border-t border-cream py-6 px-4 md:px-8 text-center text-text-secondary font-sans text-xs">
          <p>© 2026 Escritores. Plataforma de Escritura Creativa Premium.</p>
        </footer>
      </div>
    </div>
  );
}
