const base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export function apiUrl(path: string) {
  return `${base}${path}`;
}
