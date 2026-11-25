import type { ApiProduct, ProductSellerOffer } from "../types/productselleroffer";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/backend/src").replace(/\/$/, "");

export async function fetchAllProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${apiBaseUrl}/products`);
  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json() as Promise<ApiProduct[]>;
}

export async function fetchProductPage(page: number): Promise<ApiProduct[]> {
  const response = await fetch(`${apiBaseUrl}/products/paged?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json() as Promise<ApiProduct[]>;
}

export async function fetchProductById(id: number): Promise<ApiProduct> {
  const response = await fetch(`${apiBaseUrl}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load product ${id}`);
  }

  return response.json() as Promise<ApiProduct>;
}

export async function fetchProductSellers(id: number): Promise<ProductSellerOffer[]> {
  const response = await fetch(`${apiBaseUrl}/products/${id}/sellers`);
  if (!response.ok) {
    throw new Error(`Failed to load sellers for product ${id}`);
  }

  return response.json() as Promise<ProductSellerOffer[]>;
}

export async function fetchSellerById(id: number): Promise<Pick<ProductSellerOffer, "id" | "name">> {
  const response = await fetch(`${apiBaseUrl}/sellers/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to load seller ${id}`);
  }

  return response.json() as Promise<Pick<ProductSellerOffer, "id" | "name">>;
}