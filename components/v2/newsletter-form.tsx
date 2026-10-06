"use client";

import { useState } from "react";

export function NewsletterForm({ action }: { action?: "confirm" | "unsubscribe"; token?: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website: new FormData(event.currentTarget).get("website") }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to request subscription.");
      setMessage(data.message);
      setEmail("");
      setConsent(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to request subscription.");
    } finally {
      setLoading(false);
    }
  }

  if (action) return <NewsletterTokenAction action={action} />;

  return (
    <form onSubmit={subscribe} className="max-w-xl space-y-5 border-t border-[#17253d]/15 pt-6">
      <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      <label className="block space-y-2"><span className="text-xs font-semibold uppercase tracking-wider">Email address</span><input required type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#b8955d]" /></label>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-1 size-4 accent-[#17253d]" /><span>I want to receive occasional monthly Nyaycast legal-information updates by email. I understand this is optional and I can unsubscribe at any time.</span></label>
      <button type="submit" disabled={loading || !consent} className="bg-[#17253d] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50">{loading ? "Sending…" : "Email me a confirmation link"}</button>
      {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <p className="text-xs leading-relaxed text-slate-500">Your address is used only for this newsletter. Subscribing does not sign you up for consultation messages. A confirmation link is required before updates are sent.</p>
    </form>
  );
}

function NewsletterTokenAction({ action }: { action: "confirm" | "unsubscribe" }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const label = action === "confirm" ? "Confirm subscription" : "Unsubscribe";

  async function submit() {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/newsletter/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request could not be completed.");
      setMessage(data.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="space-y-4"><button type="button" disabled={loading || !!message} onClick={submit} className="bg-[#17253d] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50">{loading ? "Please wait…" : message ? "Complete" : label}</button>{message && <p role="status" className="text-sm text-emerald-800">{message}</p>}{error && <p role="alert" className="text-sm text-red-800">{error}</p>}</div>;
}