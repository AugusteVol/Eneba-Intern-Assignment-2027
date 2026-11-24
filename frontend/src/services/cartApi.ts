import type { CartItem } from "../types/cart";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

async function readResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(body?.error ?? fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchCart(accountId: number): Promise<CartItem[]> {
  const response = await fetch(`${apiBaseUrl}/accounts/${accountId}/cart`);
  return readResponse<CartItem[]>(response, "Unable to load your cart");
}

export async function addCartItem(
  accountId: number,
  productId: number,
  sellerId: number,
  quantity = 1,
): Promise<CartItem> {
  const response = await fetch(`${apiBaseUrl}/accounts/${accountId}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, sellerId, quantity }),
  });

  return readResponse<CartItem>(response, "Unable to add this item to your cart");
}

export async function updateCartItemQuantity(
  accountId: number,
  itemId: number,
  quantity: number,
): Promise<CartItem[]> {
  const response = await fetch(
    `${apiBaseUrl}/accounts/${accountId}/cart/items/${itemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    },
  );

  return readResponse<CartItem[]>(response, "Unable to update the quantity");
}

export async function removeCartItem(
  accountId: number,
  itemId: number,
): Promise<CartItem[]> {
  const response = await fetch(
    `${apiBaseUrl}/accounts/${accountId}/cart/items/${itemId}`,
    { method: "DELETE" },
  );

  return readResponse<CartItem[]>(response, "Unable to remove this item");
}

export async function clearCart(accountId: number): Promise<CartItem[]> {
  const response = await fetch(`${apiBaseUrl}/accounts/${accountId}/cart`, {
    method: "DELETE",
  });

  return readResponse<CartItem[]>(response, "Unable to clear your cart");
}
