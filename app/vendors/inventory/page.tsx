import { connection } from "next/server";
import { redirect } from "next/navigation";
import VendorHeader from "../vendor-header";
import VendorSetupNotice from "../vendor-setup-notice";
import InventoryManager, { type VendorProduct } from "./inventory-manager";
import { getSupabasePublicConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function VendorInventoryPage() {
  await connection();
  if (!getSupabasePublicConfig()) return <main className="vendor-page"><VendorSetupNotice /></main>;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return <main className="vendor-page"><VendorSetupNotice /></main>;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/vendors/login");

  const { data: profile, error: profileError } = await supabase
    .from("vendor_profiles")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !profile) {
    return <main className="vendor-workspace"><VendorHeader /><p className="vendor-notice" role="alert">We could not load your vendor profile.</p></main>;
  }
  if (profile.status !== "approved") redirect("/vendors/dashboard");

  const { data: products, error: productsError } = await supabase
    .from("vendor_products")
    .select("id, name, category, price_ngn, stock_count, active, review_status")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false });

  const inventory: VendorProduct[] = (products ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price_ngn: Number(product.price_ngn),
    stock_count: product.stock_count,
    active: product.active,
    review_status: product.review_status,
  }));

  return (
    <main className="vendor-workspace">
      <VendorHeader />
      <section className="vendor-dashboard-content">
        <p className="vendor-eyebrow">STORE OPERATIONS</p>
        <h1>Inventory</h1>
        <p className="vendor-intro">Manage your catalog and on-hand stock.</p>
        {productsError ? (
          <p className="vendor-notice" role="alert">We could not load inventory. Please refresh or contact the team.</p>
        ) : (
          <InventoryManager vendorId={user.id} products={inventory} />
        )}
      </section>
    </main>
  );
}
