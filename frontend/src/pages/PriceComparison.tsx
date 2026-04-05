import { Activity, BadgePercent, Boxes, Store } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { PriceComparisonTable } from '../components/prices/PriceComparisonTable';
import { PriceHistoryChart } from '../components/prices/PriceHistoryChart';
import { LoadingStateCard } from '../components/ui/LoadingSpinner';
import { BloomCard, Chip, PageIntro, SectionHeading, StatCard } from '../components/ui/DashboardPrimitives';
import type { Price } from '../types';

export const PriceComparison = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

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

  const query = (searchParams.get('q') ?? '').toLowerCase().trim();
  const filteredPrices = useMemo(() => {
    if (!query) return prices;
    return prices.filter((price) =>
      `${price.product.name} ${price.vendor.name}`.toLowerCase().includes(query)
    );
  }, [prices, query]);

  // calculate some stats for the summary cards
  const lowestPrice = filteredPrices.length > 0 ? Math.min(...filteredPrices.map((price) => price.price)) : 0;
  const averagePrice = filteredPrices.length > 0
    ? filteredPrices.reduce((sum, price) => sum + price.price, 0) / filteredPrices.length
    : 0;
  const uniqueVendors = new Set(filteredPrices.map((price) => price.vendor.id)).size;
  const inStockRate = filteredPrices.length > 0
    ? (filteredPrices.filter((price) => price.inStock).length / filteredPrices.length) * 100
    : 0;
  // sort by price and take top 4 cheapest
  const cheapestOffers = [...filteredPrices]
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
            {filteredPrices.length > 0 && <PriceHistoryChart prices={filteredPrices} />}

            <BloomCard className="min-w-0">
              <SectionHeading
                title="Günstigste Angebote"
                description="Aktuell preisgünstigste Artikel im erfassten Sortiment."
                action={<Chip>{cheapestOffers.length} tracked</Chip>}
              />
              <div className="space-y-3">
                {cheapestOffers.map((price) => (
                  <div key={price.id} className="rounded-[22px] border border-white/75 bg-white/72 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
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
            </BloomCard>
          </div>

          <PriceComparisonTable prices={filteredPrices} />
        </div>
      )}
    </div>
  );
};
