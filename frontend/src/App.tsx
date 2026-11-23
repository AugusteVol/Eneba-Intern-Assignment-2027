import { Header } from "./components/Header";
import { BannerCarousel } from "./components/BannerCarousel";
import { CategoryRail } from "./components/CategoryRail";
import { ProductSection } from "./components/ProductSection";
//import { GiftCardSection } from "./components/GiftCardSection";
//<GiftCardSection section={{ id: "gift-cards", title: "Gift cards", type: "gift-cards", items: [] }} loading={false} />

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <BannerCarousel />
        <CategoryRail categories={[]} loading={false} />
        <ProductSection />
      </main>
    </div>
  );
}