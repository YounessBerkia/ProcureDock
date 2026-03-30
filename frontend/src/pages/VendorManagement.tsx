import { Gauge, PackageSearch, Star, Truck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { VendorCard } from '../components/vendors/VendorCard';
import { VendorDetailModal } from '../components/vendors/VendorDetailModal';
import { LoadingStateCard } from '../components/ui/LoadingSpinner';
import { PageIntro, SectionHeading, StatCard, SurfaceCard } from '../components/ui/DashboardPrimitives';
import type { VendorWithCount } from '../types';

export const VendorManagement = () => {
  const [vendors, setVendors] = useState<VendorWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<VendorWithCount[]>('/vendors');
      setVendors(res.data);
      setError(null);
    } catch {
      setError('Lieferanten konnten nicht geladen werden. Ist das Backend gestartet?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const averageRating = vendors.length > 0
    ? vendors.reduce((sum, vendor) => sum + vendor.rating, 0) / vendors.length
    : 0;
  const averageDelivery = vendors.length > 0
    ? vendors.reduce((sum, vendor) => sum + (vendor.avgDeliveryDays ?? 0), 0) / vendors.length
    : 0;
  const averageReliability = vendors.length > 0
    ? vendors.reduce((sum, vendor) => sum + vendor.reliability, 0) / vendors.length
    : 0;
  const featuredVendor = [...vendors].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Lieferantennetzwerk"
        title="Lieferantenverwaltung"
        description="Lieferantenstamm pflegen, zuverlässigste Partner identifizieren und Bestellhistorie vor der nächsten Preisverhandlung einsehen."
        meta="Lieferantenübersicht"
      />

      {loading && (
        <LoadingStateCard label="Lieferanten werden geladen..." />
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={PackageSearch}
              label="Erfasste Lieferanten"
              value={String(vendors.length)}
              hint="Lieferanten, die aktuell im Beschaffungssystem geführt werden."
              accent="blue"
            />
            <StatCard
              icon={Star}
              label="Ø Bewertung"
              value={averageRating.toFixed(1)}
              hint="Durchschnittliche Lieferantenzufriedenheit über alle erfassten Partner."
              accent="orange"
            />
            <StatCard
              icon={Truck}
              label="Ø Lieferzeit"
              value={`${averageDelivery.toFixed(1)} Tage`}
              hint="Typische Vorlaufzeit der aktuell aktiven Lieferanten."
              accent="green"
            />
            <StatCard
              icon={Gauge}
              label="Ø Zuverlässigkeit"
              value={`${averageReliability.toFixed(0)}%`}
              hint="Zuverlässigkeitsniveau über das gesamte Lieferantennetzwerk."
              accent="slate"
            />
          </div>

          {featuredVendor && (
            <SurfaceCard>
              <SectionHeading
                title="Toplieferant"
                description="Bestbewerteter Lieferant im aktuellen Lieferantenportfolio."
              />
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{featuredVendor.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {featuredVendor.reliability}% Zuverlässigkeit · Ø {featuredVendor.avgDeliveryDays ?? '—'} Tage Lieferzeit · {featuredVendor._count.budgetEntries} erfasste Bestellungen
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-500">Beste Bewertung</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-700">{featuredVendor.rating.toFixed(1)} / 5</p>
                </div>
              </div>
            </SurfaceCard>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onClick={() => setSelectedVendorId(vendor.id)}
              />
            ))}
          </div>

          {vendors.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <p className="text-gray-400 text-sm">Keine Lieferanten gefunden</p>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedVendorId && (
        <VendorDetailModal
          vendorId={selectedVendorId}
          onClose={() => setSelectedVendorId(null)}
          onRatingUpdated={fetchVendors}
        />
      )}
    </div>
  );
};
