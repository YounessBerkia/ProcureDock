import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

interface SurfaceCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'md' | 'lg';
}

const paddingClasses: Record<NonNullable<SurfaceCardProps['padding']>, string> = {
  none: '',
  md: 'p-6',
  lg: 'p-8',
};

export const SurfaceCard = ({ children, className, padding = 'md' }: SurfaceCardProps) => {
  return (
    <section
      className={cx(
        'animate-in-soft relative overflow-hidden rounded-[28px] border border-white/80 bg-white/88 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]',
        paddingClasses[padding],
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.7),transparent_26%)]" />
      <div className="relative">{children}</div>
    </section>
  );
};

interface BloomCardProps {
  children: ReactNode;
  className?: string;
}

export const BloomCard = ({ children, className }: BloomCardProps) => {
  return (
    <section
      className={cx(
        'animate-in-soft relative overflow-hidden rounded-[30px] border border-white/75 bg-white/84 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_22px_50px_rgba(15,23,42,0.11)]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.18),transparent_22%),radial-gradient(circle_at_86%_10%,rgba(186,230,253,0.22),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.72))]" />
      <div className="relative">{children}</div>
    </section>
  );
};

interface ChipProps {
  children: ReactNode;
  className?: string;
}

export const Chip = ({ children, className }: ChipProps) => {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border border-blue-100/90 bg-white/72 px-3 py-1 text-xs font-medium text-blue-700 shadow-[0_6px_18px_rgba(59,130,246,0.08)] backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  );
};

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string;
  actions?: ReactNode;
}

export const PageIntro = ({
  eyebrow = 'Workspace',
  title,
  description,
  meta,
  actions,
}: PageIntroProps) => {
  return (
    <section className="animate-in-soft relative overflow-hidden rounded-[34px] border border-slate-800/60 bg-[linear-gradient(135deg,#0f172a_0%,#101827_52%,#14213f_100%)] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.24)] md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(59,130,246,0.26),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(125,211,252,0.22),transparent_26%),radial-gradient(circle_at_52%_100%,rgba(30,41,59,0.85),transparent_42%)]" />
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute left-10 top-8 h-24 w-24 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute bottom-4 right-16 h-28 w-28 rounded-full border border-white/5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50/78 md:text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          {meta && (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-blue-50 shadow-sm backdrop-blur">
              {meta}
            </span>
          )}
          {actions}
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  accent?: 'blue' | 'green' | 'orange' | 'slate';
}

const accentClasses: Record<NonNullable<StatCardProps['accent']>, string> = {
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_10px_25px_rgba(59,130,246,0.28)]',
  green: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-[0_10px_25px_rgba(16,185,129,0.24)]',
  orange: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.24)]',
  slate: 'bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-[0_10px_25px_rgba(51,65,85,0.24)]',
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  hint,
  accent = 'blue',
}: StatCardProps) => {
  return (
    <SurfaceCard className="animate-in-soft-delay-1 h-full overflow-hidden">
      <div className="mb-5 h-1.5 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">{hint}</p>
        </div>

        <div className={cx('flex h-12 w-12 items-center justify-center rounded-2xl', accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </SurfaceCard>
  );
};

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionHeading = ({ title, description, action }: SectionHeadingProps) => {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 md:text-[1.35rem]">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {action}
    </div>
  );
};
