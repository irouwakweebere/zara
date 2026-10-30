import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import VendorHeader from "../vendor-header";
import VendorSetupNotice from "../vendor-setup-notice";
import { getSupabasePublicConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function VendorDashboardPage() {
  await connection();
  if (!getSupabasePublicConfig()) return <main className="vendor-page"><VendorSetupNotice /></main>;

  const supabase = await createSupabaseServerClient();
  if (!supabase) return <main className="vendor-page"><VendorSetupNotice /></main>;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/vendors/login");

  const { data: profile, error: profileError } = await supabase
    .from("vendor_profiles")
    .select("email, status, created_at")
    .eq("id", user.id)
    .maybeSingle();
  const { data: store, error: storeError } = await supabase
    .from("vendor_stores")
    .select("slug, store_name, description")
    .eq("vendor_id", user.id)
    .maybeSingle();

  if (profileError || storeError) {
    return (
      <main className="vendor-workspace">
        <VendorHeader />
        <p className="vendor-notice" role="alert">We could not load your vendor profile. Please contact the team for help.</p>
      </main>
    );
  }

  if (!profile || !store) return <main className="vendor-page"><VendorSetupNotice /></main>;

  return (
    <main className="vendor-workspace">
      <VendorHeader />
      <section className="vendor-dashboard-content">
        <p className="vendor-eyebrow">YOUR VENDOR WORKSPACE</p>
        <h1>{store.store_name}</h1>
        <p className="vendor-intro">Welcome back. Your store and inventory are managed here.</p>
        {profile.status === "pending" ? (
          <div className="vendor-notice" role="status">
            <strong>Application under review</strong>
            <p>Your account is awaiting staff approval. You can sign in to check its status; inventory tools unlock after approval.</p>
          </div>
        ) : profile.status === "rejected" ? (
          <div className="vendor-notice" role="alert">
            <strong>Application not approved</strong>
            <p>Contact the Skindrug Gist team if you have questions about your application.</p>
          </div>
        ) : (
          <>
            <div className="vendor-dashboard-card">
              <p className="vendor-eyebrow">PUBLIC STOREFRONT</p>
              <h2>{store.store_name}</h2>
              <p>{store.description || "Add a short introduction to your store."}</p>
              <Link className="vendor-button" href={`/shops/${store.slug}`}>View your storefront</Link>
            </div>
            <div className="vendor-dashboard-card">
              <p className="vendor-eyebrow">INVENTORY</p>
              <h2>Manage your products</h2>
              <p>Add products, update stock, and track which listings are waiting for staff review.</p>
              <Link className="vendor-button" href="/vendors/inventory">Open inventory</Link>
            </div>
            <p className="vendor-policy">Online checkout is not enabled yet. Product listings are reviewed by the team before appearing publicly.</p>
          </>
        )}
      </section>
    </main>
  );
}
