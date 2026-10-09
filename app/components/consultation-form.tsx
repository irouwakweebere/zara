"use client";

import { useEffect, useState, type FormEvent } from "react";

type ConsultationFormProps = {
  triggerClassName: string;
  triggerLabel: string;
};

export default function ConsultationForm({ triggerClassName, triggerLabel }: ConsultationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.has("consent") ? "true" : "false";

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus({ message: result.error ?? "We couldn't send that just yet. Please try again.", success: false });
        return;
      }

      form.reset();
      setStatus({ message: "You’re on our list. We’ll be in touch soon.", success: true });
    } catch {
      setStatus({ message: "We couldn't connect. Please check your connection and try again.", success: false });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button className={triggerClassName} onClick={() => { setStatus(null); setIsOpen(true); }} type="button">
        {triggerLabel}
      </button>
      {isOpen && (
        <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section className="consultation-dialog" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
            <button className="dialog-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close consultation form">×</button>
            <p className="dialog-eyebrow">A GOOD FIRST STEP · ALWAYS FREE</p>
            <h2 id="consultation-title">Let’s talk skin.</h2>
            <p className="dialog-description">Tell us a little about yourself. A real person from our team will be in touch to find a time that works.</p>
            <form className="consultation-form" onSubmit={handleSubmit}>
              <label>Your name<input autoComplete="name" maxLength={80} name="name" placeholder="How should we address you?" required /></label>
              <label>Email address<input autoComplete="email" maxLength={254} name="email" placeholder="you@example.com" required type="email" /></label>
              <label>What would you like help with?
                <select defaultValue="" name="goal" required>
                  <option disabled value="">Choose what feels closest</option>
                  <option value="Breakouts">Breakouts</option>
                  <option value="Dryness or sensitivity">Dryness or sensitivity</option>
                  <option value="Uneven tone or texture">Uneven tone or texture</option>
                  <option value="Building a routine">Building a routine</option>
                  <option value="Something else">Something else</option>
                </select>
              </label>
              <label>Anything else you’d like us to know? <span>(optional)</span><textarea maxLength={800} name="concerns" placeholder="Share only what you're comfortable sharing." rows={3} /></label>
              <label className="consent-label"><input name="consent" required type="checkbox" />I agree to be contacted about my consultation request and understand my details will be stored to arrange it.</label>
              <label className="honeypot" aria-hidden="true">Leave this field empty<input autoComplete="off" name="website" tabIndex={-1} /></label>
              {status && <p className={`form-status${status.success ? " success" : ""}`} role="status">{status.message}</p>}
              <button className="submit-button" disabled={isSubmitting} type="submit">{isSubmitting ? "Sending..." : "Request my free consultation"}</button>
            </form>
            <p className="form-privacy">Your details are only used to follow up on this request. Please don’t include sensitive medical information.</p>
          </section>
        </div>
      )}
    </>
  );
}