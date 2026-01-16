export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  // Obtener token del localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Construir headers incluyendo el token si existe
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // No establecer Content-Type si el body es FormData
  // (el navegador lo establece automáticamente con el boundary correcto)
  const isFormData = init?.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as any;

  if (!response.ok) {
    const message =
      payload?.message ?? response.statusText ?? "Error en la petición";
    throw new Error(message);
  }

  return payload as T;
}
