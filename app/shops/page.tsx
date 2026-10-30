import Link from "next/link";
import { connection } from "next/server";
import VendorSetupNotice from "../vendors/vendor-setup-notice";
import { getSupabasePublicConfig } from "../lib/supabase/config";
import { createSupabaseServerClient } from "../lib/supabase/server";

export default async function ShopsPage() {
  await connection();
  if (!getSupabasePublicConfig()) {
    return (
      <main className="vendor-page">
        <section className="vendor-message">
          <p className="vendor-eyebrow">SHOP SKINCARE</p>
          <h1>Independent shops are on the way.</h1>
          <p>Vendor storefronts will appear here after the shop database has been connected and approved vendors are ready.</p>
          <Link className="vendor-button" href="/">Back to Skindrug Gist</Link>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return <main className="vendor-page"><VendorSetupNotice /></main>;
  const { data: stores, error } = await supabase
    .from("vendor_stores")
    .select("slug, store_name, description")
    .order("store_name");

  return (
    <main className="vendor-page">
      <section className="vendor-directory">
        <Link className="vendor-back-link" href="/">← Skindrug Gist</Link>
        <p className="vendor-eyebrow">THE SKINDRUG GIST MARKETPLACE</p>
        <h1>Find your next skincare shop.</h1>
        <p className="vendor-intro">Browse independent, staff-approved vendor storefronts.</p>
        {error ? (
          <p className="vendor-notice" role="alert">We could not load the shop directory. Please try again later.</p>
        ) : !stores?.length ? (
          <p className="vendor-empty">No approved storefronts are open just yet. Check back soon.</p>
        ) : (
          <div className="vendor-store-grid">
            {stores.map((store) => (
              <article className="vendor-store-card" key={store.slug}>
                <p className="vendor-eyebrow">INDEPENDENT VENDOR</p>
                <h2>{store.store_name}</h2>
                <p>{store.description || "A Skindrug Gist marketplace shop."}</p>
                <Link className="text-link" href={`/shops/${store.slug}`}>Visit shop <span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
