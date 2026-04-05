import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content - centered with max-width */}
      <div className="relative z-10 ml-0 min-w-0 flex-1">
        <div className="flex min-h-screen w-full min-w-0 flex-col px-4 py-6 md:px-6 md:py-8 lg:pl-4 lg:pr-8 xl:pl-5 xl:pr-10 2xl:pl-6 2xl:pr-12">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page content */}
          <main className="mt-7 flex min-w-0 flex-col gap-8 pb-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="mt-auto border-t border-white/70 py-5 text-center text-xs text-gray-400">
            IHK Wiesbaden · IT-Beschaffungsmanagement · Entwickelt von Youness Berkia · 2026
          </footer>
        </div>
      </div>
    </div>
  );
};
