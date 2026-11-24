export interface CartItem {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  region: string;
  platform: string;
  sellerId: number;
  sellerName: string;
  unitPrice: number;
  quantity: number;
  cashbackPercentage: number;
  total: number;
}
