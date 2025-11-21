interface AlertsCardProps {
  title: string;
  summary: string;
  items: string[];
}

const AlertsCard = ({ title, summary, items }: AlertsCardProps) => {
  return (
    <section
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition dark:border-white/10 dark:bg-gray-900/70 surface-panel"
      data-dashboard-card="alerts"
    >
      <p className="text-xs uppercase tracking-[0.28em] text-rose-400">{title}</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{summary}</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-gray-300">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-rose-200/60 bg-rose-50/70 px-3 py-2 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AlertsCard;
