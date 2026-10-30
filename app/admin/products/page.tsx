import { connection } from "next/server";
import AdminSectionHeader from "../admin-section-header";
import ProductReview, { type ProductReviewItem } from "./product-review";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export default async function AdminProductsPage() {
  await connection();
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return (
      <main className="admin-main vendor-review-admin">
        <AdminSectionHeader />
        <div className="admin-content"><p className="vendor-notice" role="alert">Product review requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.</p></div>
      </main>
    );
  }

  const { data: products, error: productsError } = await supabase
    .from("vendor_products")
    .select("id, name, category, price_ngn, stock_count, review_status, vendor_id")
    .eq("review_status", "pending")
    .order("created_at", { ascending: false });

  if (productsError) {
    return (
      <main className="admin-main vendor-review-admin">
        <AdminSectionHeader />
        <div className="admin-content"><p className="vendor-notice" role="alert">We could not load product listings. Check that the vendor database schema has been applied.</p></div>
      </main>
    );
  }

  const vendorIds = [...new Set((products ?? []).map((product) => product.vendor_id))];
  const { data: stores, error: storesError } = vendorIds.length
    ? await supabase.from("vendor_stores").select("vendor_id, store_name").in("vendor_id", vendorIds)
    : { data: [], error: null };
  if (storesError) {
    return (
      <main className="admin-main vendor-review-admin">
        <AdminSectionHeader />
        <div className="admin-content"><p className="vendor-notice" role="alert">We could not load vendor store names.</p></div>
      </main>
    );
  }

  const storeNames = new Map((stores ?? []).map((store) => [store.vendor_id, store.store_name]));
  const reviewItems: ProductReviewItem[] = (products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price_ngn: Number(product.price_ngn),
    stock_count: product.stock_count,
    review_status: product.review_status,
    vendor_name: storeNames.get(product.vendor_id) ?? "Unknown vendor",
  }));

  return (
    <main className="admin-main vendor-review-admin">
      <AdminSectionHeader />
      <div className="admin-content vendor-admin-content">
        <p className="admin-eyebrow">STAFF WORKSPACE</p>
        <h1>Product review</h1>
        <p className="admin-subheading">Listings remain hidden until a staff member approves them. Prescription-only products are not allowed.</p>
        <ProductReview products={reviewItems} />
      </div>
    </main>
  );
}
