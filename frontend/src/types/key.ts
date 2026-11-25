import type { ApiProduct, ProductSellerOffer } from "../types/productselleroffer";

export interface PurchaseKey {
  id: number;
  orderId: number;
  productId: number;
  sellerId: number | null;
  productName: string;
  unitPrice: number;
  keyValue: string;
  createdAt: string;
}
export interface KeyDetails {
  key: PurchaseKey;
  product: ApiProduct;
  seller: Pick<ProductSellerOffer, "id" | "name"> | null;
}