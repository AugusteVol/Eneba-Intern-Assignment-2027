import { useEffect, useState } from "react";
import { fetchOrderKeys } from "../services/keyApi";
import { fetchProductById, fetchSellerById } from "../services/productApi";
import type { KeyDetails } from "../types/key";
import type { ApiProduct, ProductSellerOffer } from "../types/productselleroffer";

export function KeyPage() {
  const accountId = Number(localStorage.getItem("accountId"));
  const orderId = Number(new URLSearchParams(window.location.search).get("orderId"));
  const validAccount = Number.isSafeInteger(accountId) && accountId > 0;
  const validOrder = Number.isSafeInteger(orderId) && orderId > 0;
  const [keys, setKeys] = useState<KeyDetails[]>([]);
  const [loading, setLoading] = useState(validAccount && validOrder);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!validAccount || !validOrder) return;

    let active = true;
    fetchOrderKeys(accountId, orderId)
      .then(async (result) => {
        const products = new Map<number, Promise<ApiProduct>>();
        const sellers = new Map<number, Promise<Pick<ProductSellerOffer, "id" | "name">>>();
        return Promise.all(result.map(async (key) => {
          const product = products.get(key.productId) ?? fetchProductById(key.productId);
          products.set(key.productId, product);

          let seller = null;
          if (key.sellerId !== null) {
            seller = sellers.get(key.sellerId) ?? fetchSellerById(key.sellerId);
            sellers.set(key.sellerId, seller);
          }
          const [productDetails, sellerDetails] = await Promise.all([product, seller]);
          return { key, product: productDetails, seller: sellerDetails };
        }));
      })
      .then((result) => {
        if (active) setKeys(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load your keys.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [accountId, orderId, validAccount, validOrder]);

  return (
    <section className="key-page" aria-labelledby="key-page-title">
      <h1 id="key-page-title">Thank you for your purchase!</h1>

      {!validAccount ? <p role="alert">Log in to view your keys.</p> : null}
      {validAccount && !validOrder ? <p role="alert">No valid order was specified.</p> : null}
      {loading ? <p>Loading your keys...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {validAccount && validOrder && !loading && !error && keys.length === 0
        ? <p>No keys found for this order.</p>
        : null}

      {keys.map(({ key, product, seller }) => (
      <div className="key-delivery-card" key={key.id}>
        <div className="key-product-overview">
          <div className="key-product-image">
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/images/product-placeholder.svg";
              }}
            />
          </div>

          <div className="key-product-information">
            <h2>{product.name}</h2>
            <div className="key-product-facts">
              <div className="key-product-fact">
                <span className="key-fact-icon key-region-icon" aria-hidden="true">◎</span>
                <div>
                  <span className="key-fact-label">Region</span>
                  <strong>{product.region}</strong>
                  <span className="key-fact-note">Check activation restrictions</span>
                </div>
              </div>

              <div className="key-product-fact">
                <span className="key-fact-icon key-platform-icon" aria-hidden="true">◉</span>
                <div>
                  <span className="key-fact-label">Platform</span>
                  <strong>{product.platform}</strong>
                  <span className="key-fact-note">Activation instructions</span>
                </div>
              </div>

              <div className="key-product-fact">
                <span className="key-fact-icon key-code-icon" aria-hidden="true">⚿</span>
                <div>
                  <span className="key-fact-label">Product type</span>
                  <strong>Activation key</strong>
                </div>
              </div>

              <div className="key-product-fact key-compatible-fact">
                <div>
                  <span className="key-fact-label">Compatible with</span>
                  <strong>{product.platform}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="key-code-heading">Digital product code</h3>
        <section className="key-code-panel" aria-label="Product key">
          <div className="key-code-value">
            <strong>{key.keyValue}</strong>
            <button type="button" aria-label="Copy product code">▢</button>
          </div>
          <div className="key-action-buttons">
            <button className="key-activate-button" type="button">
              Activate on platform
            </button>
            <button className="key-gift-button" type="button">
              Print as a gift
            </button>
          </div>

          <div className="key-library-row">
            <span>Not ready to use it yet? You can always find your code in your library.</span>
            <button type="button">My games</button>
          </div>
        </section>

        <p className="key-refund-note">
          This is a digital product. Once a product key has been viewed, it may no longer be eligible for a refund.
        </p>

        <div className="key-seller-row">
          <div className="key-seller-information">
            <span className="key-seller-avatar" aria-hidden="true">★</span>
            <div>
              <span className="key-seller-label">Sold by</span>
              <strong>{seller?.name ?? "Seller unavailable"}</strong>
              <span className="key-seller-rating-placeholder" aria-hidden="true" />
            </div>
          </div>
          <button className="key-report-button" type="button">
            <span aria-hidden="true">⚠</span>
            Report a problem
          </button>
        </div>
      </div>
      ))}
    </section>
  );
}
