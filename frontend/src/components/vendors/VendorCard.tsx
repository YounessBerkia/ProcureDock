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
      className="group w-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="mb-5 flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colorClass} shadow-sm`}>
          <span className="text-white text-lg font-bold">{vendor.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-800">{vendor.name}</h3>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
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

      <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
        <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor.reliability}%</p>
          <p className="text-xs text-gray-400">Zuverl.</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
          <Truck className="w-4 h-4 text-blue-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor.avgDeliveryDays ?? '—'}d</p>
          <p className="text-xs text-gray-400">Lieferzeit</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
          <Package className="w-4 h-4 text-sky-500" />
          <p className="mt-2 text-sm font-semibold text-gray-800">{vendor._count.budgetEntries}</p>
          <p className="text-xs text-gray-400">Bestellungen</p>
        </div>
      </div>
    </button>
  );
};
