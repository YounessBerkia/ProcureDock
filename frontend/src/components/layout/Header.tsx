import { useEffect, useRef } from 'react';
import { Bell, Menu, Search, Sparkles, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useGlobalSearch } from '../search/SearchProvider';

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
  const { query, setQuery, results, isOpen, openResults, closeResults, submitQuery, goToResult, isLoading } = useGlobalSearch();
  const searchRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        closeResults();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [closeResults]);

  return (
    <header className="relative z-20">
      <div className="flex w-full flex-col gap-4 rounded-[30px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl md:px-5 lg:flex-row lg:items-center lg:justify-between">
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
              <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-blue-600">
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
          <div ref={searchRef} className="relative hidden lg:block">
            <label className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/72 px-3 py-2.5 text-sm text-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-200 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onFocus={openResults}
                onChange={(e) => {
                  setQuery(e.target.value);
                  openResults();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    submitQuery();
                  }
                  if (e.key === 'Escape') {
                    closeResults();
                  }
                }}
                placeholder="Produkte, Lieferanten, Budget suchen ..."
                className="w-64 border-0 bg-transparent p-0 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
            </label>

            {isOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-30 w-[26rem] overflow-hidden rounded-[26px] border border-white/80 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl">
                <div className="border-b border-slate-200/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {isLoading ? 'Suche lädt …' : 'Schnellzugriff'}
                </div>
                <div className="max-h-[26rem] overflow-y-auto p-2">
                  {results.length === 0 ? (
                    <div className="rounded-2xl px-4 py-6 text-sm text-gray-400">
                      Keine Treffer für deine suche.
                    </div>
                  ) : (
                    results.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => goToResult(result)}
                        className="flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">{result.title}</p>
                          <p className="mt-0.5 truncate text-xs text-gray-400">{result.subtitle}</p>
                        </div>
                        <span className="rounded-full border border-blue-100 bg-blue-50/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                          {result.type}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden rounded-2xl border border-blue-100/90 bg-gradient-to-r from-blue-50/90 to-cyan-50/90 px-3 py-2 text-xs font-medium text-blue-700 shadow-[0_8px_20px_rgba(59,130,246,0.08)] md:flex md:items-center md:gap-2">
            <Sparkles className="h-4 w-4" />
            Zuletzt aktualisiert
          </div>

          <button className="relative rounded-2xl border border-white/80 bg-white/82 p-2.5 text-gray-600 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/82 px-2.5 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
