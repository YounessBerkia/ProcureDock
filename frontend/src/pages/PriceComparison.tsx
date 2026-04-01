import { Activity, BadgePercent, Boxes, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PriceComparisonTable } from '../components/prices/PriceComparisonTable';
import { PriceHistoryChart } from '../components/prices/PriceHistoryChart';
import { LoadingStateCard } from '../components/ui/LoadingSpinner';
import { PageIntro, SectionHeading, StatCard, SurfaceCard } from '../components/ui/DashboardPrimitives';
import type { Price } from '../types';

export const PriceComparison = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch all prices on mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const res = await api.get<Price[]>('/prices');
        setPrices(res.data);
      } catch {
        setError('Preise konnten nicht geladen werden. Ist das Backend gestartet?');
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // calculate some stats for the summary cards
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map((price) => price.price)) : 0;
  const averagePrice = prices.length > 0
    ? prices.reduce((sum, price) => sum + price.price, 0) / prices.length
    : 0;
  const uniqueVendors = new Set(prices.map((price) => price.vendor.id)).size;
  const inStockRate = prices.length > 0
    ? (prices.filter((price) => price.inStock).length / prices.length) * 100
    : 0;
  // sort by price and take top 4 cheapest
  const cheapestOffers = [...prices]
    .sort((a, b) => a.price - b.price)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        eyebrow="Marktübersicht"
        title="Preisvergleich"
        description="Lieferantenangebote auf einen Blick vergleichen, Verfügbarkeiten prüfen und den günstigsten Kaufzeitpunkt vor der nächsten Bestellung erkennen."
        meta="Aktuelle Marktpreise"
      />

      {loading && (
        <LoadingStateCard label="Preisdaten werden geladen..." />
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
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BadgePercent}
              label="Bestes Angebot"
              value={`€${lowestPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
              hint="Derzeit günstigster erfasster Preis über alle Angebote."
              accent="blue"
            />
            <StatCard
              icon={Activity}
              label="Durchschnittspreis"
              value={`€${averagePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`}
              hint="Nützliche Vergleichsbasis vor Angebotsannahme."
              accent="slate"
            />
            <StatCard
              icon={Store}
              label="Aktive Lieferanten"
              value={String(uniqueVendors)}
              hint="Lieferanten im aktuellen Vergleichsset."
              accent="green"
            />
            <StatCard
              icon={Boxes}
              label="Verfügbarkeitsquote"
              value={`${inStockRate.toFixed(0)}%`}
              hint="Anteil der Angebote, die sofort lieferbar sind."
              accent="orange"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
            {prices.length > 0 && <PriceHistoryChart prices={prices} />}

            <SurfaceCard>
              <SectionHeading
                title="Günstigste Angebote"
                description="Aktuell preisgünstigste Artikel im erfassten Sortiment."
              />
              <div className="space-y-3">
                {cheapestOffers.map((price) => (
                  <div key={price.id} className="rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">{price.product.name}</p>
                        <p className="truncate text-xs text-gray-400">{price.vendor.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          €{price.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs ${price.inStock ? 'text-green-600' : 'text-red-500'}`}>
                          {price.inStock ? 'Auf Lager' : 'Nicht verfügbar'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>

          <PriceComparisonTable prices={prices} />
        </div>
      )}
    </div>
  );
};
