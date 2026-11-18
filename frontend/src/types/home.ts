export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
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
