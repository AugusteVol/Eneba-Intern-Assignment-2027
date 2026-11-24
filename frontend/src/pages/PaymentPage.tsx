import { useEffect, useState } from "react";
import { clearCart, fetchCart } from "../services/cartApi";
import { fetchProductById, fetchProductSellers } from "../services/productApi";
import type { ProductSellerOffer } from "../types/productselleroffer";

const paymentProviders = [
  {
    id: "card",
    name: "Credit or debit card",
    hint: "Visa, Mastercard, Maestro",
  },
  {
    id: "paypal",
    name: "PayPal",
    hint: "Pay with your PayPal balance",
  },
  {
    id: "skrill",
    name: "Skrill",
    hint: "Use your Skrill wallet",
  },
  {
    id: "paysera",
    name: "Paysera",
    hint: "Bank links and wallets",
  },
  {
    id: "bank-transfer",
    name: "Bank transfer",
    hint: "Pay directly from your bank",
  },
  {
    id: "mobile",
    name: "Mobile payment",
    hint: "Apple Pay and Google Pay",
  },
] as const;

type PaymentProviderId = (typeof paymentProviders)[number]["id"];

interface PaymentLine {
  key: string;
  name: string;
  detail: string;
  quantity: number;
  total: number;
}

export function PaymentPage() {
  const accountId = Number(localStorage.getItem("accountId"));
  const isSignedIn = Number.isInteger(accountId) && accountId > 0;

  const searchParams = new URLSearchParams(window.location.search);
  const productIdParam = Number(searchParams.get("productId"));
  const sellerIdParam = Number(searchParams.get("sellerId"));
  const isBuyNow = Number.isInteger(productIdParam) && productIdParam > 0;

  const [lines, setLines] = useState<PaymentLine[]>([]);
  const [loading, setLoading] = useState(isSignedIn);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<PaymentProviderId | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;

    let active = true;
    setLoading(true);
    setError("");

    const loadLines = async (): Promise<PaymentLine[]> => {
      if (isBuyNow) {
        const [product, offers] = await Promise.all([
          fetchProductById(productIdParam),
          fetchProductSellers(productIdParam),
        ]);

        const offer =
          offers.find((candidate) => candidate.id === sellerIdParam) ??
          offers.reduce<ProductSellerOffer | null>(
            (lowest, candidate) =>
              lowest === null || candidate.price < lowest.price
                ? candidate
                : lowest,
            null,
          );

        if (!offer) throw new Error("This offer is no longer available.");

        return [
          {
            key: `product-${product.id}`,
            name: product.name,
            detail: `${offer.name} · ${product.region} · ${product.platform}`,
            quantity: 1,
            total: offer.price,
          },
        ];
      }

      const cart = await fetchCart(accountId);

      return cart.map((item) => ({
        key: `cart-${item.id}`,
        name: item.name,
        detail: `${item.sellerName} · € ${item.unitPrice.toFixed(2)} each`,
        quantity: item.quantity,
        total: item.total,
      }));
    };

    loadLines()
      .then((loadedLines) => {
        if (active) setLines(loadedLines);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your order",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId, isBuyNow, isSignedIn, productIdParam, sellerIdParam]);

  useEffect(() => {
    if (!processing) return;

    const timer = window.setTimeout(async () => {
      if (!isBuyNow) {
        try {
          await clearCart(accountId);
        } catch {
          // The simulated payment has already succeeded; navigation still proceeds.
        }
      }

      window.location.href = "/key";
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [accountId, isBuyNow, processing]);

  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.total, 0);

  const handleCheckout = () => {
    if (!provider || processing || lines.length === 0) return;
    setProcessing(true);
  };

  const backLink = isBuyNow
    ? { href: `/products/${productIdParam}`, label: "Back to product" }
    : { href: "/cart", label: "Back to cart" };

  return (
    <main className="payment-page">
      <div className="payment-layout">
        <section className="payment-card" aria-labelledby="payment-title">
          <div className="payment-heading">
            <h1 id="payment-title">Payment</h1>
            <span>Step 2 of 2</span>
          </div>

          {!isSignedIn ? (
            <div className="payment-empty">
              <p>Log in to continue to checkout.</p>
              <a className="cart-continue" href="/login">Log in</a>
            </div>
          ) : loading ? (
            <p className="payment-status">Loading your order…</p>
          ) : error && lines.length === 0 ? (
            <p className="payment-status cart-error" role="alert">{error}</p>
          ) : lines.length === 0 ? (
            <div className="payment-empty">
              <p>Your cart is empty.</p>
              <a className="cart-continue" href="/">Browse games</a>
            </div>
          ) : (
            <>
              <fieldset className="payment-providers">
                <legend>Payment method</legend>
                {paymentProviders.map((option) => (
                  <label
                    className={`payment-provider${
                      provider === option.id ? " is-selected" : ""
                    }`}
                    key={option.id}
                  >
                    <input
                      type="radio"
                      name="payment-provider"
                      value={option.id}
                      checked={provider === option.id}
                      onChange={() => setProvider(option.id)}
                      disabled={processing}
                    />
                    <span className="payment-provider-info">
                      <span className="payment-provider-name">
                        {option.name}
                      </span>
                      <span className="payment-provider-hint">
                        {option.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>

              {error ? <p className="cart-error" role="alert">{error}</p> : null}

              <div className="payment-actions">
                <button
                  className="payment-submit"
                  type="button"
                  onClick={handleCheckout}
                  disabled={!provider || processing}
                >
                  Checkout
                </button>
                <span className="payment-hint">
                  {provider
                    ? "This is a simulated payment. No real money will be charged."
                    : "Select a payment method to continue."}
                </span>
                <a className="cart-continue" href={backLink.href}>
                  {backLink.label}
                </a>
              </div>
            </>
          )}
        </section>

        {isSignedIn && !loading && lines.length > 0 ? (
          <aside className="cart-summary payment-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul className="payment-summary-items">
              {lines.map((line) => (
                <li className="payment-summary-item" key={line.key}>
                  <span>
                    {line.name}
                    {line.quantity > 1 ? ` × ${line.quantity}` : ""}
                  </span>
                  <strong>€ {line.total.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <strong>€ {total.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
          </aside>
        ) : null}
      </div>

      {processing ? (
        <div
          className="payment-processing"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="payment-processing-title"
        >
          <div className="payment-processing-card">
            <span className="payment-spinner" aria-hidden="true" />
            <h2 id="payment-processing-title">Processing payment</h2>
            <p>Please wait while we confirm your order…</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
