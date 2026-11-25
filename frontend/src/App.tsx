import { Header } from "./components/Header";
import { BannerCarousel } from "./components/BannerCarousel";
import { CategoryRail } from "./components/CategoryRail";
import { ProductSection } from "./components/ProductSection";
import { useEffect, useState } from "react";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { fetchAccountById } from "./services/authApi";
import { CartPage } from "./pages/CartPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { PaymentPage } from "./pages/PaymentPage";
import { KeyPage } from "./pages/KeyPage";
import { OrderHistory } from "./pages/OrderHistory";
import { AllGamesPage } from "./pages/AllGamesPage";
//import { GiftCardSection } from "./components/GiftCardSection";
//<GiftCardSection section={{ id: "gift-cards", title: "Gift cards", type: "gift-cards", items: [] }} loading={false} />

export default function App() {
  const getRoute = (): {
    page: "home" | "all-games" | "product" | "search" | "login" | "register" | "cart" | "favorites" | "payment" | "key" | "order-history";
    productId?: number;
    query?: string;
  } => {
    const match = window.location.pathname.match(/^\/products\/([1-9][0-9]*)\/?$/);
    if (match) return { page: "product", productId: Number(match[1]) };
    if (window.location.pathname === "/all-games") return { page: "all-games" };
    if (window.location.pathname === "/login") return { page: "login" };
    if (window.location.pathname === "/register") return { page: "register" };
    if (window.location.pathname === "/cart") return {page : "cart"};
    if (window.location.pathname === "/favorites") return {page : "favorites"};
    if (window.location.pathname === "/payment") return { page: "payment" };
    if (window.location.pathname === "/key") return { page: "key" };
    if (window.location.pathname === "/order-history") return { page: "order-history" };
    if (window.location.pathname === "/search") {
      return {
        page: "search",
        query: new URLSearchParams(window.location.search).get("q")?.trim() ?? "",
      };
    }
    return { page: "home" };
  };

  const [route, setRoute] = useState(getRoute);
  const [categoriesOpen, setCategoriesOpen] = useState(
    () => window.location.pathname === "/all-games" &&
      new URLSearchParams(window.location.search).get("categories") === "open",
  );
  const [accountUsername, setAccountUsername] = useState<string>();
  const [accountLoading, setAccountLoading] = useState(() => {
    const accountId = Number(localStorage.getItem("accountId"));
    return Number.isInteger(accountId) && accountId > 0;
  });

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
          if (active) localStorage.removeItem("accountId");
        })
        .finally(() => {
          if (active) setAccountLoading(false);
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
      page: "home" | "all-games" | "product" | "search" | "login" | "register" | "cart" | "favorites" | "payment" | "key" | "order-history";
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
          onAllGames={() => navigate("/all-games", { page: "all-games" })}
          onHome={() => navigate("/", { page: "home" })}
          onSearch={(query) =>
            navigate(`/search?q=${encodeURIComponent(query)}`, { page: "search", query })
          }
          onLogin={() => navigate("/login", { page: "login" })}
          onCart={() => navigate("/cart", { page: "cart"})}
          onFavorites={() => navigate("/favorites", { page: "favorites"})}
          onOrderHistory={() => navigate("/order-history", { page: "order-history" })}
          onCategories={() => {
            if (route.page === "all-games") {
              setCategoriesOpen((open) => !open);
            } else {
              window.location.href = "/all-games?categories=open";
            }
          }}
          categoriesOpen={route.page === "all-games" && categoriesOpen}
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
            <div className="content-section page-section-heading">
              <h1>Most popular products</h1>
            </div>
            <ProductSection onSelectProduct={openProduct} />
          </>
        ) : route.page === "all-games" ? (
          <AllGamesPage categoriesOpen={categoriesOpen} onSelectProduct={openProduct} />
        ) : route.page === "search" ? (
          <SearchResultsPage
            query={route.query ?? ""}
            onSelectProduct={openProduct}
          />
        ) : route.page === "login" ? (
          <LoginPage />
        ) : route.page === "register" ? (
          <RegisterPage />
        ) : route.page === "cart" ? (
          <CartPage />
        ) : route.page === "favorites" ? (
          <FavoritesPage />
        ) : route.page === "payment" ? (
          <PaymentPage />
        ) : route.page === "key" ? (
          <KeyPage />
        ) : route.page === "order-history" ? (
          accountLoading ? (
            <section className="order-history-page"><p role="status">Loading account...</p></section>
          ) : accountUsername ? (
            <OrderHistory accountId={Number(localStorage.getItem("accountId"))} />
          ) : (
            <section className="order-history-page">
              <p>Log in to view your order history.</p>
              <a href="/login">Log in</a>
            </section>
          )
        ) : (
          <ProductDetailPage productId={route.productId ?? 1} />
        )}
      </main>
    </div>
  );
}