export const ROLE_SLUGS = ['pusat', 'daerah', 'sekolah', 'murid', 'mitra'] as const;

export type RoleSlug = typeof ROLE_SLUGS[number];

const ROLE_LABELS: Record<RoleSlug, string> = {
  pusat: 'Pusat',
  daerah: 'Daerah',
  sekolah: 'Sekolah',
  murid: 'Murid',
  mitra: 'Mitra',
};

export const normalizeRoleSlug = (value: unknown): RoleSlug | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const slug = value.trim().toLowerCase();
  return ROLE_SLUGS.includes(slug as RoleSlug) ? (slug as RoleSlug) : null;
};

export const getRoleDisplayName = (value: unknown): string | null => {
  const slug = normalizeRoleSlug(value);
  return slug ? ROLE_LABELS[slug] : null;
};

export const getDashboardPathForRole = (value: unknown): string => {
  const slug = normalizeRoleSlug(value);
  return slug ? `/dashboard/${slug}` : '/dashboard';
};
