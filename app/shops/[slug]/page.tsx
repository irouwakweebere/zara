import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getSupabasePublicConfig } from "../../lib/supabase/config";
import { createSupabaseServerClient } from "../../lib/supabase/server";

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);
}

export default async function VendorStorePage({ params }: PageProps<"/shops/[slug]">) {
  await connection();
  const { slug } = await params;
  if (!getSupabasePublicConfig()) {
    return (
      <main className="vendor-page">
        <section className="vendor-message">
          <p className="vendor-eyebrow">STOREFRONT</p>
          <h1>Stores are being set up.</h1>
          <p>The team is connecting the marketplace catalog.</p>
          <Link className="vendor-button" href="/shops">Browse shops</Link>
        </section>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data: store, error: storeError } = await supabase
    .from("vendor_stores")
    .select("vendor_id, slug, store_name, description")
    .eq("slug", slug)
    .maybeSingle();

  if (storeError) {
    return <main className="vendor-page"><p className="vendor-notice" role="alert">We could not load this storefront.</p></main>;
  }
  if (!store) notFound();

  const { data: products, error: productsError } = await supabase
    .from("vendor_products")
    .select("id, name, description, category, price_ngn, stock_count")
    .eq("vendor_id", store.vendor_id)
    .eq("review_status", "approved")
    .eq("active", true)
    .gt("stock_count", 0)
    .order("name");

  return (
    <main className="vendor-page">
      <section className="vendor-storefront">
        <Link className="vendor-back-link" href="/shops">← All shops</Link>
        <p className="vendor-eyebrow">INDEPENDENT SKINDRUG GIST VENDOR</p>
        <h1>{store.store_name}</h1>
        <p className="vendor-intro">{store.description || "Explore this approved vendor&apos;s skincare and beauty catalog."}</p>
        <div className="vendor-checkout-notice" role="note">
          Checkout is not enabled yet. We are completing Paystack split-payment and vendor settlement setup before taking orders.
        </div>
        {productsError ? (
          <p className="vendor-notice" role="alert">We could not load this shop&apos;s products.</p>
        ) : !products?.length ? (
          <p className="vendor-empty">This shop has no approved, in-stock products yet.</p>
        ) : (
          <div className="vendor-store-products">
            {products.map((product) => (
              <article className="vendor-product-card" key={product.id}>
                <p className="vendor-product-category">{product.category}</p>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <strong>{formatNaira(Number(product.price_ngn))}</strong>
                <span>{product.stock_count} in stock</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
