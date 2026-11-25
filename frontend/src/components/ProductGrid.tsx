import type { ApiProduct } from "../types/productselleroffer";

interface ProductGridProps {
  products: ApiProduct[];
  loading: boolean;
  error: string;
  onSelectProduct?: (id: number) => void;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  loading,
  error,
  onSelectProduct,
  emptyMessage = "No products available.",
}: ProductGridProps) {
  return (
    <section className="content-section">
      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, index) => <div className="product-card-skeleton" key={index} />)}
        </div>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : products.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <button
              className="product-card"
              type="button"
              key={product.id}
              onClick={() => onSelectProduct?.(product.id)}
            >
              <div className="product-image-wrap">
                <img src={product.imageUrl} alt={product.name} onError={(event) => {
                  event.currentTarget.src = "/images/product-placeholder.svg";
                }} />
                {product.cashbackPercentage ? <span className="cashback">Cashback {product.cashbackPercentage}%</span> : null}
              </div>
              <div className="product-details">
                <span className="product-region">{[product.region, product.platform].filter(Boolean).join(" · ")}</span>
                <strong>{product.name}</strong>
                <div className="price-row">
                  <span>From</span>
                  <strong>{product.price === null ? "Unavailable" : `€ ${product.price.toFixed(2)}`}</strong>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
