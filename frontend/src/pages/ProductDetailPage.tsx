import { useEffect, useState } from "react";
import { fetchProductById, fetchProductSellers } from "../services/homeApi";
import type { ApiProduct, ProductSellerOffer } from "../types/home";

interface ProductDetailPageProps {
  productId: number;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellers, setSellers] = useState<ProductSellerOffer[]>([]);
  const [sellerError, setSellerError] = useState("");

  useEffect(() => {
    let active = true;

    fetchProductById(productId)
      .then((item) => {
        if (active) setProduct(item);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load product");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    fetchProductSellers(productId)
      .then((offers) => {
        if (active) setSellers(offers);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setSellerError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load sellers",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="product-detail-page">
        <div className="product-detail-skeleton" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-detail-page">
        <p role="alert">{error || "Product not found."}</p>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-grid">
        <div className="product-detail-cover">
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = "/images/product-placeholder.svg";
            }}
          />
        </div>

        <div className="product-detail-content">
          <h1>{product.name}</h1>

          <div className="product-detail-meta">
            <div>
              <span className="meta-label">Region</span>
              <strong>{product.region}</strong>
              <span className="region-check" aria-label={`${product.region} activation available`}>
                ✓
              </span>
            </div>

            <div>
              <span className="meta-label">Platform</span>
              <strong>{product.platform}</strong>
            </div>
          </div>

          <div className="product-description">
            <h2>Product information</h2>
            <p>{product.description}</p>
          </div>

          {product.languages ? (
            <div className="product-languages">
              <h2>Languages</h2>
              <ul>
                {product.languages.map((language) => (
                  <li key={language}>
                    <span aria-hidden="true">✓</span>
                    {language}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="product-other-info">
            <h2>Additional information</h2>
            <dl>
              <div>
                <dt>Release date</dt>
                <dd>{product.releaseDate}</dd>
              </div>
              <div>
                <dt>Publisher</dt>
                <dd>{product.publisher}</dd>
              </div>
              <div>
                <dt>Creator</dt>
                <dd>{product.creators}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="other-sellers" aria-labelledby="other-sellers-title">
        <div className="other-sellers-heading">
          <h2 id="other-sellers-title">Other sellers</h2>
          <span>{sellers.length} offer{sellers.length === 1 ? "" : "s"}</span>
        </div>

        {sellerError ? (
          <p role="alert">{sellerError}</p>
        ) : sellers.length === 0 ? (
          <p className="other-sellers-empty">No other sellers currently offer this product.</p>
        ) : (
          <div className="seller-offers">
            {sellers.map((seller) => (
              <article className="seller-offer" key={seller.id}>
                <div className="seller-offer-name">
                  <span className="seller-avatar" aria-hidden="true">
                    {seller.name.charAt(0)}
                  </span>
                  <strong>{seller.name}</strong>
                </div>
                <div className="seller-offer-price">
                  {seller.cashbackPercentage > 0 ? (
                    <span className="seller-cashback">
                      Cashback {seller.cashbackPercentage}%
                    </span>
                  ) : null}
                  <strong>€ {seller.price.toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
