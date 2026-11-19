import type { User } from "firebase/auth";

export async function apiRequest<T>(user: User, path: string, init: RequestInit = {}): Promise<T> {
  const token = await user.getIdToken();
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(payload?.detail || "Die Anfrage konnte nicht gespeichert werden.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
