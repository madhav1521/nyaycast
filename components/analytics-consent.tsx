"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const consentVersion = "2026-10-07";
const consentStorageKey = `manas_analytics_choice:${consentVersion}`;
const consentMirrorCookie = "manas_analytics_choice";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"unknown" | "accepted" | "declined">("unknown");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(consentStorageKey);
      const mirror = document.cookie.split(";").some((item) => item.trim() === `${consentMirrorCookie}=${saved}`);
      if ((saved === "accepted" || saved === "declined") && mirror) {
        setChoice(saved);
        setVisible(false);
      } else {
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (choice !== "accepted" || pathname.startsWith("/admin")) return;
    const timer = window.setTimeout(() => {
      void fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [choice, pathname]);

  async function choose(value: "accepted" | "declined") {
    const response = await fetch("/api/analytics/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice: value }),
    });
    if (!response.ok) return;
    window.localStorage.setItem(consentStorageKey, value);
    document.cookie = `${consentMirrorCookie}=${value}; Max-Age=${365 * 24 * 60 * 60}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    setChoice(value);
    setVisible(false);
  }

  if (pathname.startsWith("/admin")) return null;

  if (!visible) {
    return choice !== "unknown" ? (
      <button type="button" onClick={() => setVisible(true)} className="fixed bottom-3 left-3 z-40 border border-slate-300 bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-700 shadow-sm hover:border-[#b8955d] print:hidden">
        Privacy choices
      </button>
    ) : null;
  }

  return (
    <aside role="dialog" aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl border border-[#17253d]/15 bg-white p-4 shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-5 print:hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="analytics-consent-title" className="text-sm font-semibold text-[#17253d]">Anonymous visitor statistics</h2>
          <p id="analytics-consent-description" className="mt-1 text-xs leading-relaxed text-slate-600">Allow a random browser ID to count visits and page views, including a return after 24 hours. We do not store your IP address, fingerprint, or consultation details. The ID lasts up to one year. Declining does not affect site use. Counts represent consenting browsers, not verified people. <Link href="/privacy" className="font-semibold text-[#17253d] underline underline-offset-2">Privacy details</Link>.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={() => choose("declined")} className="border border-slate-300 px-3 py-2 text-xs font-semibold text-[#17253d]">Decline</button>
          <button type="button" onClick={() => choose("accepted")} className="bg-[#17253d] px-3 py-2 text-xs font-semibold text-white">Allow analytics</button>
        </div>
      </div>
    </aside>
  );
}