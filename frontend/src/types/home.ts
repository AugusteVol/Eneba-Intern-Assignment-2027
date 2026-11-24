export interface Banner {
  id: number;
  productId: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
}

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
}

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

export interface HomeSection {
  id: string;
  title: string;
  type: "products" | "gift-cards";
  items: Product[];
  showAllUrl?: string;
}

export interface HomePageData {
  banners: Banner[];
  categories: Category[];
  sections: HomeSection[];
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

export interface ProductSellerOffer {
  id: number;
  name: string;
  price: number;
  cashbackPercentage: number;
}
