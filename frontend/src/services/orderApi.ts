import { getJson } from "./clientApi";

export interface Order {
  id: number;
  date: string;
  products: string[];
  total: number;
  paymentMethod: string | null;
}

export function fetchOrders(accountId: number): Promise<Order[]> {
  return getJson<Order[]>(`/accounts/${accountId}/orders`);
}
