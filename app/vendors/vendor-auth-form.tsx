"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

type VendorAuthFormProps = {
  mode: "apply" | "login";
};

function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export default function VendorAuthForm({ mode }: VendorAuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = createSupabaseBrowserClient();
      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setError("We couldn't sign you in with those details. Check your email and password.");
          return;
        }
        router.push("/vendors/dashboard");
        return;
      }

      const storeName = String(formData.get("storeName") ?? "").trim();
      const storeSlug = String(formData.get("storeSlug") ?? "").trim().toLowerCase();
      const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
      const businessRegistration = String(formData.get("businessRegistration") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();

      if (storeName.length < 2 || storeName.length > 80) {
        setError("Store name must be between 2 and 80 characters.");
        return;
      }
      if (!isValidSlug(storeSlug) || storeSlug.length > 60) {
        setError("Choose a store URL using lowercase letters, numbers, and single hyphens.");
        return;
      }
      if (phoneNumber.length < 7 || phoneNumber.length > 25) {
        setError("Enter a valid contact phone number.");
        return;
      }
      if (businessRegistration.length < 3 || businessRegistration.length > 80) {
        setError("Enter your business registration or licence reference.");
        return;
      }
      if (description.length > 500) {
        setError("Keep the store description under 500 characters.");
        return;
      }
      if (password.length < 12 || password.length > 128) {
        setError("Use a password between 12 and 128 characters.");
        return;
      }

      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: new URL("/vendors/auth/callback", window.location.origin).toString(),
          data: {
            account_type: "vendor",
            business_registration: businessRegistration,
            description,
            phone_number: phoneNumber,
            store_name: storeName,
            store_slug: storeSlug,
          },
        },
      });

      if (signupError) {
        setError("We couldn't submit this application. Check the store URL and try again.");
        return;
      }

      setMessage("Application received. Verify your email, then wait for the team to approve your vendor account.");
      form.reset();
    } catch {
      setError("Vendor access isn't configured yet. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="vendor-form" onSubmit={handleSubmit}>
      {mode === "apply" && (
        <>
          <label>
            Store name
            <input autoComplete="organization" maxLength={80} name="storeName" required />
          </label>
          <label>
            Store URL
            <span className="vendor-slug-input">
              <span>/shops/</span>
              <input autoComplete="off" maxLength={60} name="storeSlug" pattern="[a-z0-9]+(-[a-z0-9]+)*" required />
            </span>
          </label>
          <label>
            Business registration or licence reference
            <input autoComplete="off" maxLength={80} name="businessRegistration" required />
          </label>
          <label>
            Contact phone
            <input autoComplete="tel" maxLength={25} name="phoneNumber" required type="tel" />
          </label>
          <label>
            Short store introduction
            <textarea maxLength={500} name="description" rows={3} />
          </label>
        </>
      )}
      <label>
        Email address
        <input autoComplete="email" maxLength={254} name="email" required type="email" />
      </label>
      <label>
        Password
        <input autoComplete={mode === "apply" ? "new-password" : "current-password"} minLength={12} maxLength={128} name="password" required type="password" />
        {mode === "apply" && <small>Use at least 12 characters.</small>}
      </label>
      {error && <p className="vendor-form-error" role="alert">{error}</p>}
      {message && <p className="vendor-form-success" role="status">{message}</p>}
      <button className="vendor-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Please wait…" : mode === "apply" ? "Submit vendor application" : "Sign in"}
      </button>
      <p className="vendor-form-footnote">
        {mode === "apply" ? (
          <>Already approved? <Link href="/vendors/login">Sign in</Link></>
        ) : (
          <>Need a vendor account? <Link href="/vendors/apply">Apply to sell</Link></>
        )}
      </p>
    </form>
  );
}
