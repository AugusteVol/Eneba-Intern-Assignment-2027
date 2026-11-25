import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/productApi";
import type { ApiProduct } from "../types/productselleroffer";
import { ProductGrid } from "./ProductGrid";

interface ProductSectionProps {
  onSelectProduct?: (id: number) => void;
}

export function ProductSection({ onSelectProduct }: ProductSectionProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchAllProducts()
      .then((items) => {
        if (active) setProducts(items);
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
  }, []);

  return <ProductGrid products={products} loading={loading} error={error} onSelectProduct={onSelectProduct} />;
}
