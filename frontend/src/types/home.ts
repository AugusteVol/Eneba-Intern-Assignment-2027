import type { Banner } from "./banner";
import type { Category } from "./category";
import type { Product } from "./product";
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