interface ActivityItem {
  label: string;
  value: string;
}

interface ActivityCardProps {
  title: string;
  summary: string;
  items: ActivityItem[];
}

const ActivityCard = ({ title, summary, items }: ActivityCardProps) => {
  return (
    <section
      className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm transition dark:border-white/10 dark:bg-gray-900/70 surface-panel"
      data-dashboard-card="activity"
    >
      <p className="text-xs uppercase tracking-[0.28em] text-indigo-400">{title}</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{summary}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-gray-300">
        {items.map((item) => (
          <li key={item.label} className="flex items-start justify-between gap-3">
            <span>{item.label}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityCard;
