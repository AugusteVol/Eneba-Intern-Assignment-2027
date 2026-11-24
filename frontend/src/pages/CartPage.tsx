import { useEffect, useState } from "react";
import {
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../services/cartApi";
import type { CartItem } from "../types/cart";

export function CartPage() {
  const storedAccountId = Number(localStorage.getItem("accountId"));
  const accountId =
    Number.isInteger(storedAccountId) && storedAccountId > 0
      ? storedAccountId
      : null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchCart(accountId)
      .then((cart) => {
        if (active) setItems(cart);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load your cart",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId]);

  const changeQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1 || busyItemId !== null) return;

    setBusyItemId(item.id);
    setError("");

    try {
      setItems(await updateCartItemQuantity(accountId, item.id, quantity));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update the quantity",
      );
    } finally {
      setBusyItemId(null);
    }
  };

  const removeItem = async (item: CartItem) => {
    if (busyItemId !== null) return;

    setBusyItemId(item.id);
    setError("");

    try {
      setItems(await removeCartItem(accountId, item.id));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to remove this item",
      );
    } finally {
      setBusyItemId(null);
    }
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <h1>Your cart</h1>
        {!loading ? (
          <span>
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {loading ? (
        <p className="cart-status">Loading your cart…</p>
      ) : error && items.length === 0 ? (
        <p className="cart-status cart-error" role="alert">{error}</p>
      ) : items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <a className="cart-continue" href="/">Browse games</a>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {error ? <p className="cart-error" role="alert">{error}</p> : null}
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <a className="cart-item-image" href={`/products/${item.productId}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.src = "/images/product-placeholder.svg";
                      }}
                    />
                  </a>

                  <div className="cart-item-info">
                    <a className="cart-item-name" href={`/products/${item.productId}`}>
                      {item.name}
                    </a>
                    <span className="cart-item-meta">
                      {[item.region, item.platform].filter(Boolean).join(" · ")}
                    </span>
                    <span className="cart-item-seller">
                      Sold by {item.sellerName}
                      {item.cashbackPercentage > 0
                        ? ` · ${item.cashbackPercentage}% cashback`
                        : ""}
                    </span>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => changeQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || busyItemId === item.id}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => changeQuantity(item, item.quantity + 1)}
                      disabled={busyItemId === item.id}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-price">
                    <strong>€ {item.total.toFixed(2)}</strong>
                    <span>€ {item.unitPrice.toFixed(2)} each</span>
                  </div>

                  <button
                    className="cart-item-remove"
                    type="button"
                    onClick={() => removeItem(item)}
                    disabled={busyItemId === item.id}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <div className="cart-summary-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Subtotal</span>
              <strong>€ {subtotal.toFixed(2)}</strong>
            </div>
            <button
              className="cart-checkout"
              type="button"
              onClick={() => {
                window.location.href = "/payment";
              }}
            >
              Proceed to checkout
            </button>
            <span className="cart-summary-note">
              Payment is simulated. No real money will be charged.
            </span>
            <a className="cart-continue" href="/">Continue shopping</a>
          </aside>
        </div>
      )}
    </main>
  );
}
