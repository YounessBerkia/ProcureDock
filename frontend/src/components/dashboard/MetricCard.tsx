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
    <div className="rounded-[28px] border border-white/70 bg-white/92 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.12)]">
      <div className="mb-3 h-1.5 w-14 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.95))` }} />
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{title}</p>

      <div className="mb-4 rounded-2xl bg-gray-50/80 px-2 py-2" style={{ width: '100%', height: '96px' }}>
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
  );
};

export default MetricCard;
