export function isValidEmailOrUsername(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
  return /^[a-zA-Z0-9._-]+$/.test(v);
}

export function toApiUsername(login: string): string {
  const v = login.trim();
  if (v.includes('@')) {
    return v.split('@')[0] ?? v;
  }
  return v;
}
