import { useEffect, useState } from "react";
import { fetchProductById, fetchProductSellers } from "../services/productApi";
import { addCartItem, addGuestCartItem } from "../services/cartApi";
import type { ApiProduct, ProductSellerOffer } from "../types/productselleroffer";

interface ProductDetailPageProps {
  productId: number;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellers, setSellers] = useState<ProductSellerOffer[]>([]);
  const [sellerError, setSellerError] = useState("");
  const [sellersLoading, setSellersLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    setSellersLoading(true);
    setSellerError("");

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
      })
      .finally(() => {
        if (active) setSellersLoading(false);
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

  const recommendedOffer = sellers.reduce<ProductSellerOffer | null>(
    (lowestPrice, seller) =>
      lowestPrice === null || seller.price < lowestPrice.price
        ? seller
        : lowestPrice,
    null,
  );

  const handleBuyNow = () => {
    if (!recommendedOffer) return;

    const params = new URLSearchParams({
      productId: String(product.id),
      sellerId: String(recommendedOffer.id),
    });

    window.location.href = `/payment?${params.toString()}`;
  };

  const handleAddToCart = async () => {
    if (!recommendedOffer) return;

    setAddingToCart(true);
    setCartFeedback(null);

    try {
      const accountId = Number(localStorage.getItem("accountId"));
      if (Number.isInteger(accountId) && accountId > 0) {
        await addCartItem(accountId, product.id, recommendedOffer.id, 1);
      } else {
        addGuestCartItem({
          productId: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
          region: product.region,
          platform: product.platform,
          sellerId: recommendedOffer.id,
          sellerName: recommendedOffer.name,
          unitPrice: recommendedOffer.price,
          quantity: 1,
          cashbackPercentage: recommendedOffer.cashbackPercentage,
        });
      }
      setCartFeedback({ type: "success", text: "Added to your cart." });
    } catch (requestError) {
      setCartFeedback({
        type: "error",
        text:
          requestError instanceof Error
            ? requestError.message
            : "Unable to add this item to your cart.",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main className="product-detail-page">
      <div className="product-detail-layout">
        <div className="product-detail-primary">
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
        </div>

        <aside className="purchase-sidebar" aria-label="Purchase options">
          <section className="purchase-offer-card" aria-labelledby="purchase-offer-title">
            <h2 id="purchase-offer-title">Recommended offer</h2>
            {sellersLoading ? (
              <div className="purchase-offer-skeleton" aria-label="Loading offer" />
            ) : recommendedOffer ? (
              <>
                <div className="purchase-offer-details">
                  <span className="purchase-seller-name">{recommendedOffer.name}</span>
                  <strong className="purchase-price">
                    € {recommendedOffer.price.toFixed(2)}
                  </strong>
                  {recommendedOffer.cashbackPercentage > 0 ? (
                    <span className="purchase-cashback">
                      {recommendedOffer.cashbackPercentage}% cashback
                    </span>
                  ) : null}
                </div>
                <div className="purchase-buttons">
                  <button
                    className="purchase-button"
                    type="button"
                    onClick={handleBuyNow}
                  >
                    Buy now
                  </button>
                  <button
                    className="add-to-cart-button"
                    type="button"
                    aria-label={`Add ${product.name} to cart`}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    aria-busy={addingToCart}
                  >
                    <span aria-hidden="true">+</span>
                    <span aria-hidden="true">🛒</span>
                  </button>
                </div>
                {cartFeedback ? (
                  <p
                    className={`purchase-cart-feedback is-${cartFeedback.type}`}
                    role="status"
                    aria-live="polite"
                  >
                    {cartFeedback.text}
                  </p>
                ) : null}
              </>
            ) : sellerError ? (
              <p className="purchase-offer-message" role="alert">{sellerError}</p>
            ) : (
              <p className="purchase-offer-message">No offers are currently available.</p>
            )}
            {!sellersLoading && sellers.length > 1 && recommendedOffer ? (
              <div className="purchase-more-offers">
                + {sellers.length - 1} more offers from € {recommendedOffer.price.toFixed(2)}
              </div>
            ) : null}
          </section>

          <section className="purchase-security-card" aria-label="Payment security">
            <strong>Secure checkout guaranteed</strong>
            <span className="payment-methods-label">Trusted payment methods</span>
            <div className="payment-method-placeholders" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="purchase-security-divider" />
            <span className="payment-methods-label">Data encryption and protection</span>
            <div className="security-badge-placeholder" aria-hidden="true">
              <img src="/images/scamadviser-logo.png" alt="" />
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
