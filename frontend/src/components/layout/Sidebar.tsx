import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  Building2,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import icon from '../../assets/icon.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// main navigation items for the sidebar
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/preisvergleich', label: 'Preisvergleich', icon: ShoppingCart },
  { path: '/budget', label: 'Budget', icon: Wallet },
  { path: '/vendors', label: 'Lieferanten', icon: Building2 },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_52%,#172554_100%)] text-white shadow-[14px_0_50px_rgba(15,23,42,0.28)]
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen
          lg:transform-none lg:transition-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5 lg:h-auto lg:flex-col lg:items-stretch lg:gap-5 lg:px-6 lg:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden shadow-[0_14px_35px_rgba(59,130,246,0.32)]">
              <img src={icon} alt="ProcureDock" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">ProcureDock</p>
              <p className="text-xs text-slate-400">Procurement Workspace</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="hidden rounded-[24px] border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur lg:block">
            <div className="mb-3 flex items-center gap-2 text-blue-200">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">IHK Wiesbaden</span>
            </div>
            <p className="text-sm font-medium leading-6 text-slate-200">
              Beschaffungsmanagement-System der Industrie- und Handelskammer für effizientes Einkaufscontrolling.
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 lg:px-5">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </div>
          <ul className="space-y-1.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={({ isActive }) => `
                    flex items-center justify-between gap-3 rounded-xl px-4 py-3.5
                    transition-all duration-200
                    ${isActive
                      ? 'bg-white/12 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white hover:translate-x-1'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* FIXME: connect this to budget stats api */}
        <div className="border-t border-white/10 p-4 lg:p-5">
          <div className="rounded-[24px] border border-white/10 bg-white/6 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.2)] transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Budgetstand</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-blue-100">
                Q1 2026
              </span>
            </div>
            {/* todo: pull from /api/budget/stats */}
            <div className="mb-2 flex items-end justify-between gap-3">
              <span className="text-lg font-semibold text-white">€18.850</span>
              <span className="text-xs text-slate-400">37.7% of €50.000</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500"
                style={{ width: '37.7%' }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Budget im Soll – keine Eskalation erforderlich.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
