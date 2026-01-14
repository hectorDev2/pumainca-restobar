export const API_BASE_URL = "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, init);
  const payload = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    const message =
      payload?.message ?? response.statusText ?? "Error en la petición";
    throw new Error(message);
  }

  return payload as T;
}
