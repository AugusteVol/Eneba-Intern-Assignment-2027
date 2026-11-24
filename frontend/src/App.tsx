import { Header } from "./components/Header";
import { BannerCarousel } from "./components/BannerCarousel";
import { CategoryRail } from "./components/CategoryRail";
import { ProductSection } from "./components/ProductSection";
import { useEffect, useState } from "react";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { fetchAccountById } from "./services/homeApi";
//import { GiftCardSection } from "./components/GiftCardSection";
//<GiftCardSection section={{ id: "gift-cards", title: "Gift cards", type: "gift-cards", items: [] }} loading={false} />

export default function App() {
  const getRoute = (): {
    page: "home" | "cheap-games" | "product" | "search" | "login" | "register";
    productId?: number;
    query?: string;
  } => {
    const match = window.location.pathname.match(/^\/products\/([1-9][0-9]*)\/?$/);
    if (match) return { page: "product", productId: Number(match[1]) };
    if (window.location.pathname === "/cheap-games") return { page: "cheap-games" };
    if (window.location.pathname === "/login") return { page: "login" };
    if (window.location.pathname === "/register") return { page: "register" };
    if (window.location.pathname === "/search") {
      return {
        page: "search",
        query: new URLSearchParams(window.location.search).get("q")?.trim() ?? "",
      };
    }
    return { page: "home" };
  };

  const [route, setRoute] = useState(getRoute);
  const [accountUsername, setAccountUsername] = useState<string>();

  useEffect(() => {
    const handlePopState = () => setRoute(getRoute());
    window.addEventListener("popstate", handlePopState);

    const accountId = Number(localStorage.getItem("accountId"));
    if (Number.isInteger(accountId) && accountId > 0) {
      let active = true;

      fetchAccountById(accountId)
        .then((account) => {
          if (active) setAccountUsername(account.username);
        })
        .catch(() => {
          localStorage.removeItem("accountId");
        });

      return () => {
        active = false;
        window.removeEventListener("popstate", handlePopState);
      };
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (
    path: string,
    nextRoute: {
      page: "home" | "cheap-games" | "product" | "search" | "login" | "register";
      productId?: number;
      query?: string;
    },
  ) => {
    window.location.href = path;
  };

  const openProduct = (id: number) => {
    navigate(`/products/${id}`, { page: "product", productId: id });
  };

  const logout = () => {
    localStorage.removeItem("accountId");
    setAccountUsername(undefined);
  };

  return (
    <div className="app">
      {route.page !== "login" && route.page !== "register" ? (
        <Header
          onCheapGames={() => navigate("/cheap-games", { page: "cheap-games" })}
          onHome={() => navigate("/", { page: "home" })}
          onSearch={(query) =>
            navigate(`/search?q=${encodeURIComponent(query)}`, { page: "search", query })
          }
          onLogin={() => navigate("/login", { page: "login" })}
          onRegister={() => navigate("/register", { page: "register" })}
          accountUsername={accountUsername}
          onLogout={logout}
        />
      ) : null}
      <main>
        {route.page === "home" ? (
          <>
            <BannerCarousel />
            <CategoryRail categories={[]} loading={false} />
            <ProductSection onSelectProduct={openProduct} />
          </>
        ) : route.page === "cheap-games" ? (
          <section className="cheap-games-page">
            <h1>Cheap Games</h1>
            <ProductSection onSelectProduct={openProduct} />
          </section>
        ) : route.page === "search" ? (
          <SearchResultsPage
            query={route.query ?? ""}
            onSelectProduct={openProduct}
          />
        ) : route.page === "login" ? (
          <LoginPage />
        ) : route.page === "register" ? (
          <RegisterPage />
        ) : (
          <ProductDetailPage productId={route.productId ?? 1} />
        )}
      </main>
    </div>
  );
}