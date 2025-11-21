const DEFAULT_NEXT_PATH = '/dashboard';

const ALLOWED_NEXT_PREFIXES = ['/', '/dashboard', '/lapor']; 
// '/pengaturan'

const NORMALIZE_REGEX = /\/+/g;

const normalizePath = (value: string) => {
  if (!value) {
    return '/';
  }
  const replaced = value.replace(NORMALIZE_REGEX, '/');
  if (replaced.length > 1 && replaced.endsWith('/')) {
    return replaced.slice(0, -1);
  }
  return replaced;
};

const isAllowedNextPath = (path: string) => {
  if (!path.startsWith('/')) {
    return false;
  }
  const lower = path.toLowerCase();
  return ALLOWED_NEXT_PREFIXES.some((prefix) => {
    const normalizedPrefix = prefix === '/' ? '/' : prefix.toLowerCase();
    if (normalizedPrefix === '/') {
      return lower === '/';
    }
    return lower === normalizedPrefix || lower.startsWith(`${normalizedPrefix}/`);
  });
};

export const sanitizeNextPath = (candidate: unknown, fallback: string = DEFAULT_NEXT_PATH) => {
  if (typeof candidate !== 'string') {
    return fallback;
  }
  const trimmed = candidate.trim();
  if (!trimmed.startsWith('/')) {
    return fallback;
  }
  try {
    const parsed = new URL(trimmed, 'http://localhost');
    const normalizedPath = normalizePath(parsed.pathname || '/');
    if (!isAllowedNextPath(normalizedPath)) {
      return fallback;
    }
    const search = parsed.search || '';
    return `${normalizedPath}${search}`;
  } catch {
    return fallback;
  }
};

export { DEFAULT_NEXT_PATH };
