import Link from "next/link";
import { connection } from "next/server";
import VendorAuthForm from "../vendor-auth-form";
import VendorSetupNotice from "../vendor-setup-notice";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

export default async function VendorLoginPage() {
  await connection();
  if (!getSupabasePublicConfig()) return <main className="vendor-page"><VendorSetupNotice /></main>;

  return (
    <main className="vendor-page">
      <section className="vendor-panel">
        <Link className="vendor-back-link" href="/">← Skindrug Gist</Link>
        <p className="vendor-eyebrow">VENDOR WORKSPACE</p>
        <h1>Welcome back.</h1>
        <p className="vendor-intro">Sign in to manage your approved store and inventory.</p>
        <VendorAuthForm mode="login" />
      </section>
    </main>
  );
}
