"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export type VendorProduct = {
  id: string;
  name: string;
  category: string;
  price_ngn: number;
  stock_count: number;
  active: boolean;
  review_status: "pending" | "approved" | "rejected";
};

type InventoryManagerProps = {
  vendorId: string;
  products: VendorProduct[];
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);
}

export default function InventoryManager({ vendorId, products: initialProducts }: InventoryManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (name.length < 2 || name.length > 120 || description.length > 1000) {
      setError("Check the product name and description lengths.");
      setBusy(false);
      return;
    }
    if (!Number.isFinite(price) || price <= 0 || price > 100_000_000) {
      setError("Enter a valid product price in Nigerian naira.");
      setBusy(false);
      return;
    }
    if (!Number.isInteger(stock) || stock < 0 || stock > 1_000_000) {
      setError("Stock must be a whole number between 0 and 1,000,000.");
      setBusy(false);
      return;
    }
    if (imageUrl) {
      try {
        if (new URL(imageUrl).protocol !== "https:") throw new Error("Invalid URL");
      } catch {
        setError("Product image links must use HTTPS.");
        setBusy(false);
        return;
      }
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== vendorId) {
        setError("Your vendor session has expired. Sign in again.");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("vendor_products")
        .insert({
          vendor_id: user.id,
          name,
          description,
          category,
          price_ngn: Math.round(price * 100) / 100,
          stock_count: stock,
          image_url: imageUrl,
          active: true,
        })
        .select("id, name, category, price_ngn, stock_count, active, review_status")
        .single();

      if (insertError) {
        setError("We couldn't save that product. Check the details and try again.");
        return;
      }

      setProducts((current) => [data, ...current]);
      setNotice("Product saved and sent to the team for review.");
      form.reset();
    } catch {
      setError("We couldn't connect to inventory. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(id: string) {
    setError("");
    setNotice("");
    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await supabase.from("vendor_products").delete().eq("id", id).eq("vendor_id", vendorId);
    if (deleteError) {
      setError("We couldn't remove that product. Please try again.");
      return;
    }
    setProducts((current) => current.filter((product) => product.id !== id));
    setNotice("Product removed.");
  }

  async function updateStock(product: VendorProduct, stock: number) {
    setError("");
    setNotice("");
    if (!Number.isInteger(stock) || stock < 0 || stock > 1_000_000) {
      setError("Stock must be a whole number between 0 and 1,000,000.");
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase
      .from("vendor_products")
      .update({ stock_count: stock })
      .eq("id", product.id)
      .eq("vendor_id", vendorId);
    if (updateError) {
      setError("We couldn't update stock. Please try again.");
      return;
    }
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock_count: stock } : item));
    setNotice("Stock updated.");
  }

  return (
    <div className="vendor-inventory">
      <form className="vendor-form vendor-product-form" onSubmit={addProduct}>
        <h2>Add a product</h2>
        <p>New and edited listings stay hidden until the team reviews them. Prescription-only products are not allowed.</p>
        <label>Product name<input maxLength={120} name="name" required /></label>
        <label>Description<textarea maxLength={1000} name="description" rows={3} /></label>
        <label>Category
          <select defaultValue="Skincare" name="category">
            <option>Skincare</option>
            <option>Beauty</option>
            <option>Accessories</option>
          </select>
        </label>
        <label>Price (NGN)<input min="0.01" name="price" required step="0.01" type="number" /></label>
        <label>Stock quantity<input min="0" name="stock" required step="1" type="number" /></label>
        <label>Image URL (optional)<input maxLength={2000} name="imageUrl" placeholder="https://" type="url" /></label>
        {error && <p className="vendor-form-error" role="alert">{error}</p>}
        {notice && <p className="vendor-form-success" role="status">{notice}</p>}
        <button className="vendor-button" disabled={busy} type="submit">{busy ? "Saving…" : "Submit for review"}</button>
      </form>

      <section className="vendor-product-list">
        <h2>Your products <span>{products.length}</span></h2>
        {products.length === 0 ? <p className="vendor-empty">No products yet. Add your first product above.</p> : (
          <div className="vendor-product-table-wrap">
            <table className="vendor-product-table">
              <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Review</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong><small>{product.category}</small></td>
                    <td>{formatNaira(Number(product.price_ngn))}</td>
                    <td><input aria-label={`Stock for ${product.name}`} defaultValue={product.stock_count} min="0" max="1000000" onBlur={(event) => {
                      const nextStock = Number(event.currentTarget.value);
                      if (nextStock !== product.stock_count) void updateStock(product, nextStock);
                    }} step="1" type="number" /></td>
                    <td><span className={`vendor-review-status ${product.review_status}`}>{product.review_status}</span></td>
                    <td><button className="vendor-remove-button" onClick={() => void removeProduct(product.id)} type="button">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
