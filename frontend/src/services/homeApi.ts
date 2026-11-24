import type { ApiProduct, Banner, Category, HomePageData, HomeSection, ProductSellerOffer } from "../types/home";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) throw new Error(`Request failed: ${endpoint}`);
  return response.json() as Promise<T>;
}

export async function fetchBanners(): Promise<Banner[]> {
  return getJson<Banner[]>("/banners");
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

export async function fetchProductSellers(id: number): Promise<ProductSellerOffer[]> {
  const response = await fetch(`/api/products/${id}/sellers`);
  if (!response.ok) {
    throw new Error(`Failed to load sellers for product ${id}`);
  }

  return response.json() as Promise<ProductSellerOffer[]>;
}

export async function login(username: string, password: string): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}

export async function fetchAccountById(id: number): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch(`/api/accounts/${id}`);
  if (!response.ok) {
    throw new Error("Account session is no longer valid");
  }

  return response.json();
}

export async function registerAccount(
  username: string,
  password: string,
): Promise<{
  id: number;
  username: string;
  role: "admin" | "user";
}> {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role: "user" }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 409
        ? "Username already exists"
        : "Unable to register",
    );
  }

  return response.json();
}
