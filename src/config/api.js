const rawBase = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = String(rawBase).replace(/\/+$/, "");

export function apiUrl(path = "") {
  if (!path) return API_BASE_URL || "/";
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
