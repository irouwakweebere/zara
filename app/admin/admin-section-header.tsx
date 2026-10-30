import Link from "next/link";
import AdminLogoutButton from "./admin-logout-button";

export default function AdminSectionHeader() {
  return (
    <header className="admin-topbar">
      <nav aria-label="Staff workspace">
        <Link href="/admin">Staff dashboard</Link>
        <Link href="/admin/vendors">Vendor applications</Link>
        <Link href="/admin/products">Product review</Link>
        <Link href="/admin/content">Website content</Link>
      </nav>
      <div className="admin-topbar-actions">
        <Link className="admin-public-link" href="/">View public site <span aria-hidden="true">↗</span></Link>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
