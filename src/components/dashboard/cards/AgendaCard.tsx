interface AgendaItem {
  label: string;
  description: string;
}

interface AgendaCardProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  items: AgendaItem[];
}

const AgendaCard = ({ title, description, actionLabel, actionHref, items }: AgendaCardProps) => {
  return (
    <section className="rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-xl transition duration-300 dark:border-white/10 dark:bg-gray-900/70 surface-panel">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-600 dark:text-gray-300">{description}</p>
        </div>
        <a
          href={actionHref}
          className="inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 dark:border-white/10 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
        >
          {actionLabel}
        </a>
      </div>
      <ul className="mt-6 space-y-4 text-sm text-slate-600 dark:text-gray-300">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-slate-200/60 bg-slate-100/80 p-4 dark:border-white/10 dark:bg-gray-900/60"
          >
            <p className="text-xs uppercase tracking-wide text-indigo-400">{item.label}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AgendaCard;
