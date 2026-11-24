import type { Banner} from "../types/banner";
import { getJson } from "./clientApi";

export async function fetchBanners(): Promise<Banner[]> {
  return getJson<Banner[]>("/banners");
}
