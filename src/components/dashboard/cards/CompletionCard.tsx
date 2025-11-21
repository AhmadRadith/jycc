interface CompletionMetric {
  label: string;
  value: string;
  percentage: number;
  barClass: string;
}

interface CompletionCardProps {
  title: string;
  subtitle: string;
  metrics: CompletionMetric[];
}

const CompletionCard = ({ title, subtitle, metrics }: CompletionCardProps) => {
  return (
    <section
      className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-xl transition duration-300 dark:border-white/10 dark:bg-gray-900/70 surface-panel"
      data-dashboard-card="completion"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">{subtitle}</p>
      <div className="mt-4 grid gap-4 text-sm">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-gray-300">{metric.label}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{metric.value}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full rounded-full ${metric.barClass}`} style={{ width: `${metric.percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompletionCard;
