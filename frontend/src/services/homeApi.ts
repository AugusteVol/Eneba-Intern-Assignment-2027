import type { ApiProduct, Banner, Category, HomePageData, HomeSection } from "../types/home";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${endpoint}`);
  return response.json() as Promise<T>;
}

export async function fetchHomePage(): Promise<HomePageData> {
  const [banners, categories, sections] = await Promise.all([
    getJson<Banner[]>("/home/banners"),
    getJson<Category[]>("/home/categories"),
    getJson<HomeSection[]>("/home/sections"),
  ]);

  return { banners, categories, sections };
}

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json() as Promise<ApiProduct[]>;
}

export async function fetchProductById(id: number): Promise<ApiProduct> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load product ${id}`);
  }

  return response.json() as Promise<ApiProduct>;
}
