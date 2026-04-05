import { Star, Truck, ShieldCheck, Package } from 'lucide-react';
import type { VendorWithCount } from '../../types';

interface VendorCardProps {
  vendor: VendorWithCount;
  onClick: () => void;
}

// using charcode for deterministic avatar colors based on vendor name
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-sky-500',
  'bg-orange-500',
  'bg-cyan-500',
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= Math.round(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-200 fill-gray-200'
        }`}
      />
    ))}
    <span className="text-sm text-gray-500 ml-1.5">{rating.toFixed(1)}</span>
  </div>
);

export const VendorCard = ({ vendor, onClick }: VendorCardProps) => {
  const colorClass = AVATAR_COLORS[vendor.name.charCodeAt(0) % AVATAR_COLORS.length];
  const websiteLabel = vendor.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <button
      type="button"
      onClick={onClick}
      className="animate-in-soft animate-in-soft-delay-2 group relative w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/88 p-6 text-left shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(191,219,254,0.12),transparent_24%)]" />
      <div className="relative">
      <div className="mb-5 flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colorClass} shadow-sm`}>
          <span className="text-white text-lg font-bold">{vendor.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-800">{vendor.name}</h3>
            <span className="rounded-full border border-white/80 bg-white/74 px-2 py-0.5 text-[11px] font-medium text-blue-600 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              {vendor._count.prices} Preise
            </span>
          </div>
          <p className="truncate text-xs text-gray-400">{websiteLabel}</p>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <StarRating rating={vendor.rating} />
        <span className="text-xs font-medium text-gray-400 transition-colors group-hover:text-blue-500">
          Details ansehen
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-slate-200/70 pt-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-white/75 bg-white/72 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor.reliability}%</p>
          <p className="text-xs text-gray-400">Zuverl.</p>
        </div>
        <div className="rounded-[20px] border border-white/75 bg-white/72 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <Truck className="w-4 h-4 text-blue-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor.avgDeliveryDays ?? '—'}d</p>
          <p className="text-xs text-gray-400">Lieferzeit</p>
        </div>
        <div className="rounded-[20px] border border-white/75 bg-white/72 px-3 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <Package className="w-4 h-4 text-sky-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor._count.budgetEntries}</p>
          <p className="text-xs text-gray-400">Bestellungen</p>
        </div>
      </div>
      </div>
    </button>
  );
};
