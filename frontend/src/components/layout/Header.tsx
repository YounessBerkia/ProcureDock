import { Bell, Menu, Search, Sparkles, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const routeMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Gesamtübersicht über Beschaffungsvorgänge, Budgetstand und Lieferantenleistung.',
  },
  '/preisvergleich': {
    title: 'Preisvergleich',
    subtitle: 'Aktuelle Angebote vergleichen, Bestpreise identifizieren und Preisentwicklung verfolgen.',
  },
  '/budget': {
    title: 'Budgetverwaltung',
    subtitle: 'Budgetverbrauch, Kategorienverteilung und geplante vs. freigegebene Ausgaben im Überblick.',
  },
  '/vendors': {
    title: 'Lieferantenverwaltung',
    subtitle: 'Lieferantenqualität, Bewertungen, Lieferzeiten und Bestellhistorie verwalten.',
  },
};

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const currentRoute = routeMeta[location.pathname] ?? routeMeta['/'];

  return (
    <header className="relative z-20">
      <div className="flex w-full flex-col gap-4 rounded-[28px] border border-white/70 bg-white/90 px-4 py-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur md:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-blue-600">
                IHK Wiesbaden
              </span>
              <span className="hidden text-xs text-gray-400 md:inline">Beschaffungsportal</span>
            </div>
            <h1 className="mt-2 truncate text-lg font-semibold text-gray-900 md:text-xl">
              {currentRoute.title}
            </h1>
            <p className="text-sm text-gray-500">
              {currentRoute.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:justify-end">
          <label className="hidden items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500 transition-all duration-200 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 lg:flex">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Produkte, Lieferanten, Budget suchen ..."
              className="w-64 border-0 bg-transparent p-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>

          <div className="hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 text-xs font-medium text-blue-700 md:flex md:items-center md:gap-2">
            <Sparkles className="h-4 w-4" />
            Zuletzt aktualisiert
          </div>

          <button className="relative rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-2.5 py-2 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_10px_25px_rgba(59,130,246,0.25)]">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-sm font-medium text-gray-800">IHK Wiesbaden</p>
              <p className="text-xs text-gray-400">Einkaufsmanagement</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
