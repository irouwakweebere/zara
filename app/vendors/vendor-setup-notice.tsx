import Link from "next/link";

export default function VendorSetupNotice() {
  return (
    <section className="vendor-message">
      <p className="vendor-eyebrow">VENDOR PORTAL</p>
      <h1>Vendor access is being set up.</h1>
      <p>The team needs to connect Supabase authentication and apply the vendor database schema before applications and sign-in can be enabled.</p>
      <Link className="vendor-button" href="/">Back to Skindrug Gist</Link>
    </section>
  );
}
