import type { SpotlightItem } from '@/components/dashboard/types';

interface RoleSpotlightCardProps {
  items: SpotlightItem[];
  title?: string;
}

const RoleSpotlightCard = ({ items, title = 'Sorotan role' }: RoleSpotlightCardProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-indigo-100/60 bg-white/90 p-5 shadow-sm transition dark:border-indigo-400/20 dark:bg-gray-900/70 surface-panel">
      <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">{title}</p>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-gray-900/60"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              {item.badge ? (
                <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold uppercase text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoleSpotlightCard;
