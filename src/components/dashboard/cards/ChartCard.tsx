import type { ReactNode } from 'react';

interface ChartStat {
  label: string;
  value: string;
  delta: string;
}

interface ChartCardProps {
  label: string;
  title: string;
  description: string;
  stats: ChartStat[];
  chart: ReactNode;
}

const ChartCard = ({ label, title, description, stats, chart }: ChartCardProps) => {
  return (
    <section
      className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-xl transition duration-300 dark:border-white/10 dark:bg-gray-900/70 surface-panel"
      data-dashboard-card="chart"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-400">{label}</p>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-600 dark:text-gray-300">{description}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200/60 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-gray-900/80 surface-overlay">
          <div className="h-72 w-full md:h-80">{chart}</div>
        </div>
        <div className="grid gap-4 text-xs md:text-sm">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/60 bg-slate-100/90 p-4 shadow-sm dark:border-white/10 dark:bg-gray-900/60"
            >
              <p className="text-indigo-500 dark:text-indigo-200">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-indigo-300">{stat.delta}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChartCard;
