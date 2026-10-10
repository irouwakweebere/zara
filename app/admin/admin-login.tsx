"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

type AdminLoginProps = {
  configured: boolean;
};

export default function AdminLogin({ configured }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to sign in. Please try again.");
        return;
      }

      window.location.reload();
    } catch {
      setError("We couldn't connect. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel" aria-labelledby="admin-login-title">
        <Link className="admin-brand admin-login-brand" href="/" aria-label="Skindrug Gist home">
          <span className="admin-brand-mark">t.</span>
          <span>SKINDRUG<span className="admin-brand-subtitle">GIST ADMIN</span></span>
        </Link>
        {configured ? (
          <>
            <p className="admin-eyebrow">PRIVATE WORKSPACE</p>
            <h1 id="admin-login-title">Welcome back.</h1>
            <p className="admin-login-copy">Enter your admin password to manage the studio website.</p>
            <form className="admin-login-form" onSubmit={handleSubmit}>
              <label htmlFor="admin-password">Admin password</label>
              <input
                autoComplete="current-password"
                autoFocus
                id="admin-password"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              {error && <p className="admin-login-error" role="alert">{error}</p>}
              <button className="admin-login-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Checking…" : "Sign in"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="admin-eyebrow">SETUP REQUIRED</p>
            <h1 id="admin-login-title">Admin access is not configured.</h1>
            <p className="admin-login-copy">Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code> in your server environment, then restart or redeploy the app.</p>
          </>
        )}
      </section>
    </main>
  );
}