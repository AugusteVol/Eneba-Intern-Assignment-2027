import type { CartItem } from "../types/cart";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/backend/src").replace(/\/$/, "");
const guestCartStorageKey = "guestCart";

type GuestCartItemInput = Omit<CartItem, "id" | "total">;

function readGuestCart(): CartItem[] {
  const storedCart = localStorage.getItem(guestCartStorageKey);
  if (!storedCart) return [];

  const items: unknown = JSON.parse(storedCart);
  if (!Array.isArray(items)) {
    throw new Error("Unable to read your cart");
  }

  return items as CartItem[];
}

function writeGuestCart(items: CartItem[]): void {
  localStorage.setItem(guestCartStorageKey, JSON.stringify(items));
}

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

export async function fetchCart(accountId: number | null): Promise<CartItem[]> {
  if (accountId === null) return readGuestCart();

  const response = await fetch(`${apiBaseUrl}/accounts/${accountId}/cart`);
  return readResponse<CartItem[]>(response, "Unable to load your cart");
}

export function addGuestCartItem(input: GuestCartItemInput): CartItem {
  const items = readGuestCart();
  const existingItem = items.find(
    (item) => item.productId === input.productId && item.sellerId === input.sellerId,
  );

  if (existingItem) {
    const updatedItem = {
      ...existingItem,
      quantity: existingItem.quantity + input.quantity,
      total: existingItem.unitPrice * (existingItem.quantity + input.quantity),
    };
    const updatedItems = items.map((item) =>
      item.id === existingItem.id ? updatedItem : item,
    );
    writeGuestCart(updatedItems);
    return updatedItem;
  }

  const item: CartItem = {
    ...input,
    id: items.reduce((largestId, existing) => Math.max(largestId, existing.id), 0) + 1,
    total: input.unitPrice * input.quantity,
  };
  writeGuestCart([...items, item]);
  return item;
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

export async function mergeGuestCartIntoAccount(accountId: number): Promise<void> {
  for (const item of readGuestCart()) {
    await addCartItem(accountId, item.productId, item.sellerId, item.quantity);
    writeGuestCart(readGuestCart().filter((guestItem) => guestItem.id !== item.id));
  }
}

export async function updateCartItemQuantity(
  accountId: number | null,
  itemId: number,
  quantity: number,
): Promise<CartItem[]> {
  if (accountId === null) {
    const items = readGuestCart();
    const item = items.find((cartItem) => cartItem.id === itemId);
    if (!item) throw new Error("Cart item not found");

    const updatedItems = items.map((cartItem) =>
      cartItem.id === itemId
        ? { ...cartItem, quantity, total: cartItem.unitPrice * quantity }
        : cartItem,
    );
    writeGuestCart(updatedItems);
    return updatedItems;
  }

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
  accountId: number | null,
  itemId: number,
): Promise<CartItem[]> {
  if (accountId === null) {
    const items = readGuestCart();
    const updatedItems = items.filter((item) => item.id !== itemId);
    if (updatedItems.length === items.length) {
      throw new Error("Cart item not found");
    }

    writeGuestCart(updatedItems);
    return updatedItems;
  }

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
