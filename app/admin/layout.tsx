import type { ReactNode } from "react";
import { connection } from "next/server";
import AdminLogin from "./admin-login";
import { hasAdminSession, isAdminConfigured } from "../lib/admin-auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await connection();
  const configured = isAdminConfigured();
  if (!configured || !(await hasAdminSession())) {
    return <AdminLogin configured={configured} />;
  }

  return children;
}