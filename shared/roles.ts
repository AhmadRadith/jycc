export type UserRole = 'pusat' | 'daerah' | 'sekolah' | 'murid' | 'mitra' | (string & {});

export const REPORTER_ROLES = new Set<UserRole>(['murid', 'sekolah']);
export const MANAGEMENT_ROLES = new Set<UserRole>(['daerah', 'pusat', 'mitra']);
export const MITRA_ROLE: UserRole = 'mitra';
