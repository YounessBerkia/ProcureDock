import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { BudgetStats } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS: Record<string, string> = {
  hardware: '#60A5FA',
  software: '#10B981',
  services: '#F59E0B',
};
const FALLBACK_COLORS = ['#93C5FD', '#BFDBFE', '#6EE7B7', '#FCD34D', '#FDA4AF'];

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
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
      displayColors: true,
      callbacks: {
        label: (ctx) => {
          const total = (ctx.chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
          return ` €${ctx.parsed.toLocaleString('de-DE', { minimumFractionDigits: 2 })} (${pct}%)`;
        },
      },
    },
  },
};

interface BudgetPieChartProps {
  stats: BudgetStats;
}

export const BudgetPieChart = ({ stats }: BudgetPieChartProps) => {
  const categories = Object.keys(stats.byCategory);
  const amounts = categories.map((c) => stats.byCategory[c]);
  const colors = categories.map((c, i) => CATEGORY_COLORS[c] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]);

  const total = amounts.reduce((a, b) => a + b, 0);

  const data = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{ data: amounts, backgroundColor: colors, borderWidth: 0, hoverOffset: 4 }],
  };

  return (
    <div className="animate-in-soft animate-in-soft-delay-2 relative overflow-hidden rounded-[30px] border border-white/80 bg-white/88 p-8 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_26%)]" />
      <div className="relative">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Ausgaben nach Kategorie</h2>
          <span className="text-sm font-medium text-blue-500">
            €{total.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Chart */}
        <div className="relative mx-auto w-full max-w-[184px] rounded-[24px] border border-white/80 bg-gradient-to-b from-slate-50/95 to-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:mx-0" style={{ height: 184, flexShrink: 0 }}>
          <Doughnut data={data} options={chartOptions} />
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-gray-400 leading-none">Gesamt</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">
              €{(total / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex min-w-0 flex-1 flex-col gap-2">
          {categories.map((cat, i) => (
            <li key={cat} className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/68 px-3 py-2 transition-colors duration-200 hover:bg-white/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i] }} />
                <span className="text-sm text-gray-600 capitalize">{cat}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                €{stats.byCategory[cat].toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};
