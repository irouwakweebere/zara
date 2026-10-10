"use client";

export default function AdminLogoutButton() {
  async function logout() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } finally {
      window.location.replace("/admin");
    }
  }

  return <button className="admin-logout-button" onClick={logout} type="button">Sign out</button>;
}