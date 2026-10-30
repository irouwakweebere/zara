"use client";

import { useState } from "react";

export type VendorApplication = {
  id: string;
  email: string;
  phone_number: string;
  business_registration: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  store_name: string;
  slug: string;
  description: string;
};

export default function VendorReview({ applications }: { applications: VendorApplication[] }) {
  const [items, setItems] = useState(applications);
  const [error, setError] = useState("");

  async function review(id: string, status: "approved" | "rejected") {
    setError("");
    try {
      const response = await fetch("/api/admin/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        setError("We couldn't update that application. Refresh and try again.");
        return;
      }
      setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    } catch {
      setError("We couldn't connect to the vendor review service.");
    }
  }

  return (
    <>
      {error && <p className="vendor-form-error" role="alert">{error}</p>}
      {items.length === 0 ? <p className="vendor-empty">There are no vendor applications to review.</p> : (
        <div className="vendor-review-list">
          {items.map((item) => (
            <article className="vendor-review-card" key={item.id}>
              <div>
                <p className="vendor-eyebrow">{item.status.toUpperCase()} · {new Date(item.created_at).toLocaleDateString("en-NG")}</p>
                <h2>{item.store_name}</h2>
                <p>{item.description || "No store introduction provided."}</p>
                <dl>
                  <div><dt>Contact</dt><dd><a href={`mailto:${item.email}`}>{item.email}</a> · {item.phone_number}</dd></div>
                  <div><dt>Store URL</dt><dd>/shops/{item.slug}</dd></div>
                  <div><dt>Registration</dt><dd>{item.business_registration}</dd></div>
                </dl>
              </div>
              {item.status === "pending" && (
                <div className="vendor-review-actions">
                  <button className="vendor-button" onClick={() => void review(item.id, "approved")} type="button">Approve vendor</button>
                  <button className="vendor-remove-button" onClick={() => void review(item.id, "rejected")} type="button">Reject</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
