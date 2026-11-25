import { getJson } from "./clientApi";
import type { PurchaseKey } from "../types/key";

export function fetchOrderKeys(accountId: number, orderId: number): Promise<PurchaseKey[]> {
  return getJson<PurchaseKey[]>(`/accounts/${accountId}/keys?orderId=${orderId}`);
}

export async function createOrder(
  accountId: number,
  paymentMethod: string,
  offer?: { productId: number; sellerId: number },
): Promise<{ orderId: number }> {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/backend/src").replace(/\/$/, "");
  const response = await fetch(`${apiBaseUrl}/accounts/${accountId}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...offer, paymentMethod }),
  });
  if (!response.ok) {
    throw new Error("Unable to create your order. Please try again.");
  }
  return response.json() as Promise<{ orderId: number }>;
}
