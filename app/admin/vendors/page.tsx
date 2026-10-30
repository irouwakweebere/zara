import { connection } from "next/server";
import AdminSectionHeader from "../admin-section-header";
import VendorReview, { type VendorApplication } from "./vendor-review";
import { createSupabaseAdminClient } from "../../lib/supabase/admin";

export default async function AdminVendorsPage() {
  await connection();
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return (
      <main className="admin-main vendor-review-admin">
        <AdminSectionHeader />
        <div className="admin-content"><p className="vendor-notice" role="alert">Vendor review requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.</p></div>
      </main>
    );
  }

  const { data: profiles, error: profileError } = await supabase
    .from("vendor_profiles")
    .select("id, email, phone_number, business_registration, status, created_at")
    .order("created_at", { ascending: false });
  const { data: stores, error: storeError } = await supabase
    .from("vendor_stores")
    .select("vendor_id, slug, store_name, description");

  if (profileError || storeError) {
    return (
      <main className="admin-main vendor-review-admin">
        <AdminSectionHeader />
        <div className="admin-content"><p className="vendor-notice" role="alert">We could not load vendor applications. Check that the vendor database schema has been applied.</p></div>
      </main>
    );
  }

  const storesByVendor = new Map((stores ?? []).map((store) => [store.vendor_id, store]));
  const applications: VendorApplication[] = [];
  for (const profile of profiles ?? []) {
    const store = storesByVendor.get(profile.id);
    if (!store) continue;
    applications.push({
      id: profile.id,
      email: profile.email,
      phone_number: profile.phone_number,
      business_registration: profile.business_registration,
      status: profile.status,
      created_at: profile.created_at,
      store_name: store.store_name,
      slug: store.slug,
      description: store.description,
    });
  }

  return (
    <main className="admin-main vendor-review-admin">
      <AdminSectionHeader />
      <div className="admin-content vendor-admin-content">
        <p className="admin-eyebrow">STAFF WORKSPACE</p>
        <h1>Vendor applications</h1>
        <p className="admin-subheading">Review business details and approve stores before products can be published.</p>
        <VendorReview applications={applications} />
      </div>
    </main>
  );
}
