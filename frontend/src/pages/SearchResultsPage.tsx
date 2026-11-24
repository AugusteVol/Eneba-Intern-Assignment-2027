import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/homeApi";
import type { ApiProduct } from "../types/home";

interface SearchResultsPageProps {
  query: string;
  onSelectProduct: (id: number) => void;
}

export function SearchResultsPage({ query, onSelectProduct }: SearchResultsPageProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchAllProducts()
      .then((items) => {
        if (!active) return;

        const normalizedQuery = query.trim().toLocaleLowerCase();
        setProducts(
          items.filter((product) =>
            product.name.toLocaleLowerCase().includes(normalizedQuery),
          ),
        );
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load search results",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <section className="search-results-page">
      <div className="section-heading">
        <h1>Search results for "{query}"</h1>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="product-card-skeleton" key={index} />
          ))}
        </div>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <button
              className="product-card"
              type="button"
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
            >
              <div className="product-image-wrap">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.src = "/images/product-placeholder.svg";
                  }}
                />
                {product.cashbackPercentage ? (
                  <span className="cashback">
                    Cashback {product.cashbackPercentage}%
                  </span>
                ) : null}
              </div>
              <div className="product-details">
                <span className="product-region">
                  {[product.region, product.platform].filter(Boolean).join(" · ")}
                </span>
                <strong>{product.name}</strong>
                <div className="price-row">
                  <span>From</span>
                  <strong>
                    {product.price === null
                      ? "Unavailable"
                      : `€ ${product.price.toFixed(2)}`}
                  </strong>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
