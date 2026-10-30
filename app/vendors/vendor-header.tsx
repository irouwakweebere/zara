import Link from "next/link";
import VendorSignOut from "./vendor-sign-out";

export default function VendorHeader() {
  return (
    <header className="vendor-header">
      <Link className="vendor-wordmark" href="/vendors/dashboard">SKINDRUG_GIST <span>VENDOR WORKSPACE</span></Link>
      <nav aria-label="Vendor navigation">
        <Link href="/vendors/dashboard">Overview</Link>
        <Link href="/vendors/inventory">Inventory</Link>
        <Link href="/shops">Public shops</Link>
      </nav>
      <VendorSignOut />
    </header>
  );
}
