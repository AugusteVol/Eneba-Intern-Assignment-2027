import type { HomePageData } from "../types/home";
import type { Banner } from "../types/banner";
import { getJson } from "./clientApi";
import { HomeSection } from "../types/home";
import { Category } from "../types/category";

//import type { Category } from "../types/category";


export async function fetchHomePage(): Promise<HomePageData> {
  const [banners, categories, sections] = await Promise.all([
    getJson<Banner[]>("/home/banners"),
    getJson<Category[]>("/home/categories"),
    getJson<HomeSection[]>("/home/sections"),
  ]);
  return { banners, categories, sections };
}


