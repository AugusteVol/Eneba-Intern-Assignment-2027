import { useEffect, useState } from "react";
import { fetchOrders } from "../services/orderApi";
import type { Order } from "../services/orderApi";

interface OrderHistoryProps {
  accountId: number;
}

const paymentMethods: Record<string, string> = {
  card: "Credit or debit card",
  paypal: "PayPal",
  skrill: "Skrill",
  paysera: "Paysera",
  "bank-transfer": "Bank transfer",
  mobile: "Mobile payment",
};

export function OrderHistory({ accountId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetchOrders(accountId)
      .then((items) => {
        if (active) setOrders(items);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Unable to load order history.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accountId]);

  const matchingOrders = orders.filter((order) => String(order.id).includes(filter.trim()));

  return (
    <section className="order-history-page">
      <h1>Orders</h1>
      <div className="order-history-filters">
        <input
          type="search"
          aria-label="Search by order ID"
          placeholder="Search by order ID"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
        <button type="button" onClick={() => setFilter("")}>Clear filters</button>
      </div>
      {loading ? (
        <p role="status">Loading your orders...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className="order-history-table-wrap">
          <table className="order-history-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Product name</th>
                <th scope="col">Order ID</th>
                <th scope="col">Payment method</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {matchingOrders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    {orders.length === 0 ? "You have no orders yet." : "No orders match this ID."}
                  </td>
                </tr>
              ) : matchingOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.date.slice(0, 16)}</td>
                  <td className="order-history-success">Order completed</td>
                  <td>{order.products.join(", ")}</td>
                  <td>{order.id}</td>
                  <td>{order.paymentMethod === null ? "Not available" : paymentMethods[order.paymentMethod] ?? order.paymentMethod}</td>
                  <td className="order-history-total">€ {order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
