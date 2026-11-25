import { useEffect, useState } from "react";
import { fetchProductPage } from "../services/productApi";
import type { ApiProduct } from "../types/productselleroffer";
import { ProductGrid } from "./ProductGrid";

interface ProductSectionProps {
  onSelectProduct?: (id: number) => void;
}

export function ProductSection({ onSelectProduct }: ProductSectionProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchProductPage(page)
      .then(async (items) => {
        if (!active) return;
        const hasNext = items.length === 6 && (await fetchProductPage(page + 1)).length > 0;
        if (active) {
          setProducts(items);
          setHasNextPage(hasNext);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load products",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <div className="home-products">
      <ProductGrid products={products} loading={loading} error={error} onSelectProduct={onSelectProduct} />
      {(products.length > 0 || page > 1) && (
        <nav className="content-section product-pagination" aria-label="Product pages">
          <button type="button" disabled={loading || page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page}</span>
          <button type="button" disabled={loading || !!error || !hasNextPage} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
