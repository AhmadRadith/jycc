import type { RoleSlug } from '@/shared/roles';

export type SpotlightItem = {
  title: string;
  description: string;
  badge?: string;
};

export type DashboardVariant = {
  heroTagline: string;
  heroSummary: string;
  spotlight: SpotlightItem[];
  actionLabel: string;
  actionHref: string;
};

export type DashboardVariants = Partial<Record<RoleSlug, DashboardVariant>>;
