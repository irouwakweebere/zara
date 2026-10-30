import Link from "next/link";
import { connection } from "next/server";
import VendorAuthForm from "../vendor-auth-form";
import VendorSetupNotice from "../vendor-setup-notice";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

export default async function VendorApplicationPage() {
  await connection();
  if (!getSupabasePublicConfig()) return <main className="vendor-page"><VendorSetupNotice /></main>;

  return (
    <main className="vendor-page">
      <section className="vendor-panel">
        <Link className="vendor-back-link" href="/">← Skindrug Gist</Link>
        <p className="vendor-eyebrow">SELL WITH US</p>
        <h1>Apply to become a vendor.</h1>
        <p className="vendor-intro">Create your shop application. The Skindrug Gist team reviews each vendor before any products can be listed.</p>
        <p className="vendor-policy">This launch is for skincare, beauty, and accessories only. Prescription-only products are not accepted.</p>
        <VendorAuthForm mode="apply" />
      </section>
    </main>
  );
}
