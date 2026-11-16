// src/lib/escapeHtml.ts - Escape user-supplied text before putting it in HTML emails

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

// Recursively escapes every string in a JSON-like value
export function escapeHtmlDeep<T>(value: T): T {
  if (typeof value === 'string') return escapeHtml(value) as T;
  if (Array.isArray(value)) return value.map(escapeHtmlDeep) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, escapeHtmlDeep(v)])
    ) as T;
  }
  return value;
}
