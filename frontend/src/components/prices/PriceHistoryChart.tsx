import { useState, useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Price } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface PriceHistoryChartProps {
  prices: Price[];
}

// plugin that injects gradient fill before each draw - makes the chart look nicer
const gradientPlugin: Plugin<'line'> = {
  id: 'gradientFill',
  beforeDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    chart.data.datasets.forEach((dataset) => {
      dataset.backgroundColor = gradient;
    });
  },
};

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    line: {
      borderColor: '#3B82F6',
      borderWidth: 2,
      tension: 0.4,
    },
    point: {
      backgroundColor: '#3B82F6',
      borderColor: '#fff',
      borderWidth: 2,
      radius: 5,
      hoverRadius: 7,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1F2937',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (ctx) => `€${(ctx.parsed.y ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#9CA3AF', font: { size: 11 } },
    },
    y: {
      beginAtZero: false,
      grid: { color: 'rgba(0, 0, 0, 0.05)' },
      ticks: {
        color: '#9CA3AF',
        font: { size: 11 },
        callback: (val) => `€${Number(val).toLocaleString('de-DE')}`,
      },
    },
  },
};

export const PriceHistoryChart = ({ prices }: PriceHistoryChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Unique products from price list
  const products = useMemo(() => {
    const seen = new Set<string>();
    return prices
      .map((p) => p.product)
      .filter((p) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
  }, [prices]);

  const [selectedProductId, setSelectedProductId] = useState(() => products[0]?.id ?? '');

  // Prices for selected product, sorted by date
  const filtered = useMemo(
    () => prices
      .filter((p) => p.productId === selectedProductId)
      .sort((a, b) => new Date(a.scrapedAt).getTime() - new Date(b.scrapedAt).getTime()),
    [prices, selectedProductId]
  );

  const labels = filtered.map((p) =>
    format(new Date(p.scrapedAt), 'dd.MM.yy', { locale: de })
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: filtered.map((p) => p.price),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.15)', // overridden by plugin
        borderColor: '#3B82F6',
        tension: 0.4,
      },
    ],
  };

  const lowestPrice = filtered.length > 0 ? Math.min(...filtered.map((p) => p.price)) : null;

  return (
    <div className="animate-in-soft animate-in-soft-delay-2 relative overflow-hidden rounded-[30px] border border-white/80 bg-white/88 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(191,219,254,0.12),transparent_24%)]" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Preisverlauf</h2>
            {lowestPrice !== null && (
              <p className="mt-0.5 text-sm text-gray-500">
                Bestes Angebot: <span className="font-medium text-green-600">€{lowestPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
              </p>
            )}
          </div>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="rounded-2xl border border-white/80 bg-white/82 px-4 py-2 text-sm text-gray-700 shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-slate-300 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* chart area a bit more alive, but dont overdo it */}
        <div className="rounded-[24px] border border-white/80 bg-gradient-to-b from-slate-50/95 via-white to-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
          {filtered.length === 0 ? (
            <div className="flex h-80 items-center justify-center text-sm text-gray-400">
              Keine Preisdaten für dieses Produkt
            </div>
          ) : (
            <div className="h-80">
              <Line
                ref={chartRef}
                data={chartData}
                options={chartOptions}
                plugins={[gradientPlugin]}
              />
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            {[...new Set(filtered.map((p) => p.vendor.name))].map((name) => (
              <span key={name} className="flex items-center gap-1.5 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-xs text-gray-500 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
                <span className="inline-block h-0.5 w-3 rounded bg-blue-500" />
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
