export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  platform: string;
  region?: string;
  price: number;
  cashbackPercentage?: number;
  currencyAmount?: number;
  kind: "game_key" | "game_currency_key";
  sellerName?: string;
}