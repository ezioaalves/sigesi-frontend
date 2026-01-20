// Default to same origin so Vite dev proxy (or production reverse proxy) is used
export const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    // include cookies so an authenticated session (OAuth2) is forwarded
    credentials: (options.credentials as RequestCredentials) || "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const body = await parseJsonSafe(res);
    const message = (body && (body.message || body.error)) || res.statusText;
    const err = new Error(String(message));
    // Attach extra debug info
    (err as any).status = res.status;
    (err as any).responseBody = body;
    console.error("apiFetch error:", { path, status: res.status, body });
    throw err;
  }

  return parseJsonSafe(res);
}

export default apiFetch;
