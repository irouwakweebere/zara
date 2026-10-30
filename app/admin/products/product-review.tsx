"use client";

import { useState } from "react";

export type ProductReviewItem = {
  id: string;
  name: string;
  category: string;
  price_ngn: number;
  stock_count: number;
  review_status: "pending" | "approved" | "rejected";
  vendor_name: string;
};

export default function ProductReview({ products }: { products: ProductReviewItem[] }) {
  const [items, setItems] = useState(products);
  const [error, setError] = useState("");

  async function review(id: string, status: "approved" | "rejected") {
    setError("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        setError("We couldn't update that product. Refresh and try again.");
        return;
      }
      setItems((current) => current.map((item) => item.id === id ? { ...item, review_status: status } : item));
    } catch {
      setError("We couldn't connect to the product review service.");
    }
  }

  const pending = items.filter((product) => product.review_status === "pending");
  return (
    <>
      {error && <p className="vendor-form-error" role="alert">{error}</p>}
      {pending.length === 0 ? <p className="vendor-empty">There are no products waiting for review.</p> : (
        <div className="vendor-review-list">
          {pending.map((product) => (
            <article className="vendor-review-card" key={product.id}>
              <div>
                <p className="vendor-eyebrow">PRODUCT · {product.category}</p>
                <h2>{product.name}</h2>
                <p>{product.vendor_name} · NGN {Number(product.price_ngn).toLocaleString("en-NG")} · {product.stock_count} in stock</p>
              </div>
              <div className="vendor-review-actions">
                <button className="vendor-button" onClick={() => void review(product.id, "approved")} type="button">Approve listing</button>
                <button className="vendor-remove-button" onClick={() => void review(product.id, "rejected")} type="button">Reject</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
