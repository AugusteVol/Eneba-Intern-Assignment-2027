const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${endpoint}`);
  return response.json() as Promise<T>;
}