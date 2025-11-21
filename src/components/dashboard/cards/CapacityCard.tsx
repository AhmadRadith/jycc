interface CapacityItem {
  label: string;
  percentage: number;
  barClass: string;
  valueLabel?: string;
}

interface CapacityCardProps {
  title: string;
  summary: string;
  items: CapacityItem[];
}

const CapacityCard = ({ title, summary, items }: CapacityCardProps) => {
  return (
    <section
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition dark:border-white/10 dark:bg-gray-900/70 surface-panel"
      data-dashboard-card="capacity"
    >
      <p className="text-xs uppercase tracking-[0.28em] text-indigo-400">{title}</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{summary}</h2>
      <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-gray-300">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-gray-400">
              <span>{item.label}</span>
              <span>{item.valueLabel ?? `${item.percentage}%`}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full rounded-full ${item.barClass}`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CapacityCard;
