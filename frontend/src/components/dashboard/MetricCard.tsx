import {
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  data: DataPoint[];
  suffix?: string;
  color?: string;
}

export const MetricCard = ({ title, value, data, suffix, color = '#3B82F6' }: MetricCardProps) => {
  return (
    <div className="animate-in-soft animate-in-soft-delay-2 relative overflow-hidden rounded-[28px] border border-white/80 bg-white/88 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.68),rgba(255,255,255,0.82))]" />
      <div className="relative">
      <div className="mb-3 h-1.5 w-14 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, rgba(125,211,252,0.92))` }} />
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>

      <div className="mb-4 rounded-2xl border border-white/70 bg-gradient-to-b from-slate-50 to-white px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]" style={{ width: '100%', height: '96px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-baseline">
        <p className="text-3xl font-semibold tracking-tight text-gray-900">
          {value}
        </p>
        {suffix && (
          <p className="ml-2 text-sm text-gray-400">{suffix}</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default MetricCard;
