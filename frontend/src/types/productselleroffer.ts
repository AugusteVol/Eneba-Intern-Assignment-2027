export interface ProductSellerOffer {
  id: number;
  name: string;
  price: number;
  cashbackPercentage: number;
}
export interface ApiProduct {
  id: number;
  name: string;
  kind: "game_key" | "game_currency_key";
  region: string;
  platform: string;
  description: string;
  releaseDate: string;
  publisher: string;
  creators: string;
  languages: string[] | null;
  currencyAmount: number | null;
  price: number | null;
  cashbackPercentage: number | null;
  imageUrl: string;
}