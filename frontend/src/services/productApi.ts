import type { ApiProduct, ProductSellerOffer } from "../types/productselleroffer";

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

export async function fetchProductSellers(id: number): Promise<ProductSellerOffer[]> {
  const response = await fetch(`/api/products/${id}/sellers`);
  if (!response.ok) {
    throw new Error(`Failed to load sellers for product ${id}`);
  }

  return response.json() as Promise<ProductSellerOffer[]>;
}