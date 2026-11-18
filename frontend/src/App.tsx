import { useEffect, useState } from "react";
import { fetchHomePage } from "./services/homeApi";
import type { HomePageData } from "./types/home";
import { Header } from "./components/Header";
import { BannerCarousel } from "./components/BannerCarousel";
import { CategoryRail } from "./components/CategoryRail";
import { ProductSection } from "./components/ProductSection";
import { GiftCardSection } from "./components/GiftCardSection";

const emptyHomePage: HomePageData = {
  banners: [],
  categories: [],
  sections: [],
};

export default function App() {
  const [homePage, setHomePage] = useState<HomePageData>(emptyHomePage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchHomePage()
      .then((data) => {
        if (active) setHomePage(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app">
      <Header />
      <main>
        <BannerCarousel banners={homePage.banners} loading={loading} />
        <CategoryRail categories={homePage.categories} loading={loading} />
        {homePage.sections.map((section) =>
          section.type === "gift-cards" ? (
            <GiftCardSection key={section.id} section={section} loading={loading} />
          ) : (
            <ProductSection key={section.id} section={section} loading={loading} />
          ),
        )}
      </main>
    </div>
  );
}