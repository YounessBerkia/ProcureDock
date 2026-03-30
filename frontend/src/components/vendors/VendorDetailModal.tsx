import { useState, useEffect } from 'react';
import { X, Star, ExternalLink, Truck, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { api } from '../../services/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { VendorWithDetails } from '../../types';

interface VendorDetailModalProps {
  vendorId: string;
  onClose: () => void;
  onRatingUpdated: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  planned:   'bg-gray-100 text-gray-600',
  approved:  'bg-blue-100 text-blue-700',
  ordered:   'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
};
const STATUS_LABELS: Record<string, string> = {
  planned: 'Geplant', approved: 'Genehmigt', ordered: 'Bestellt', delivered: 'Geliefert',
};

const InteractiveStars = ({
  current,
  onRate,
}: {
  current: number;
  onRate: (r: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= (hovered || current);
        return (
          <button
            key={i}
            onClick={() => onRate(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="rounded-md p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Star
              className={`w-6 h-6 transition-colors duration-150 ${
                filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
              }`}
            />
          </button>
        );
      })}
      <span className="text-sm text-gray-500 ml-2">{current.toFixed(1)} / 5</span>
    </div>
  );
};

export const VendorDetailModal = ({ vendorId, onClose, onRatingUpdated }: VendorDetailModalProps) => {
  const [vendor, setVendor] = useState<VendorWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    api.get<VendorWithDetails>(`/vendors/${vendorId}`)
      .then((r) => setVendor(r.data))
      .finally(() => setLoading(false));
  }, [vendorId]);

  const handleRate = async (rating: number) => {
    if (!vendor || ratingLoading) return;
    setRatingLoading(true);
    try {
      await api.post(`/vendors/${vendorId}/rate`, { rating });
      setVendor((v) => v ? { ...v, rating } : v);
      onRatingUpdated();
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="px-6 py-16">
              <LoadingSpinner size="lg" label="Lieferantendetails werden geladen..." />
            </div>
          ) : vendor ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{vendor.name}</h2>
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-blue-500 transition-colors duration-200 hover:text-blue-600"
                  >
                    {vendor.website.replace('https://', '')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100">
                    <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Zuverlässigkeit</p>
                      <p className="text-lg font-semibold text-gray-800">{vendor.reliability}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100">
                    <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Lieferzeit</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {vendor.avgDeliveryDays ?? '—'} Tage
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Bewertung</p>
                  <InteractiveStars
                    current={vendor.rating}
                    onRate={handleRate}
                  />
                  {ratingLoading && (
                    <p className="text-xs text-gray-400 mt-2">Wird gespeichert…</p>
                  )}
                </div>

                {/* Order History */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Bestellhistorie
                    <span className="ml-2 text-xs text-blue-500 font-normal">
                      {vendor.budgetEntries.length} Einträge
                    </span>
                  </p>

                  {vendor.budgetEntries.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">
                      Noch keine Bestellungen für diesen Lieferanten
                    </p>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Beschreibung
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Betrag
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Datum
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vendor.budgetEntries.map((entry) => (
                            <tr key={entry.id} className="transition-colors duration-200 hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-800 font-medium">{entry.description}</p>
                                {entry.product && (
                                  <p className="text-xs text-gray-400 mt-0.5">{entry.product.name}</p>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                                €{(entry.amount * entry.quantity).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                {format(new Date(entry.purchaseDate), 'dd.MM.yyyy', { locale: de })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[entry.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                  {STATUS_LABELS[entry.status] ?? entry.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-400">Lieferant nicht gefunden</div>
          )}
        </div>
      </div>
    </>
  );
};
