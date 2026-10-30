"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

export default function VendorSignOut() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function signOut() {
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Sign out failed. Please try again.");
        return;
      }
      router.replace("/vendors/login");
    } catch {
      setError("Vendor access is not available right now.");
    }
  }

  return (
    <>
      {error && <span className="vendor-sign-out-error" role="alert">{error}</span>}
      <button className="vendor-sign-out" onClick={signOut} type="button">Sign out</button>
    </>
  );
}
