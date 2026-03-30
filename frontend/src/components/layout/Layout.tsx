import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content - centered with max-width */}
      <div className="relative z-10 flex-1 ml-0 lg:ml-72">
        <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-3 py-6 md:px-6 md:py-8 lg:px-8">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page content */}
          <main className="mt-6 flex flex-col gap-8 pb-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-gray-100 py-4 text-center text-xs text-gray-400">
            IHK Wiesbaden · IT-Beschaffungsmanagement · Entwickelt von Youness Berkia · 2026
          </footer>
        </div>
      </div>
    </div>
  );
};