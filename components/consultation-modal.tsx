"use client";

import { useEffect, useState } from "react";
import { normalizePhoneNumber } from "@/lib/common";

export function ConsultationModal({ phone }: { phone?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.location.search.includes("consultation=received")) {
        setOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSuccess = () => setOpen(true);
    window.addEventListener("consultation-success", handleSuccess);
    return () => window.removeEventListener("consultation-success", handleSuccess);
  }, []);

  function closeModal() {
    setOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("consultation");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }

  if (!open) return null;

  const phoneNumber = phone || "+91 99788 44826";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consultation-modal-title"
    >
      <div className="bg-[#17253d] text-white border border-[#b8955d]/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative font-sans">
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg p-2 rounded-lg transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl flex-shrink-0">
            ✓
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#b8955d] block">
              STATUS: RECEIVED
            </span>
            <h2 id="consultation-modal-title" className="text-xl font-serif text-white font-semibold">
              Consultation Request Received
            </h2>
          </div>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Thank you for reaching out to Advocate Manas A. Agravat & Associates. Your consultation request has been successfully submitted and logged.
          </p>

          <div className="bg-[#20314f] border border-slate-700/80 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#b8955d] font-semibold text-xs sm:text-sm">
              <span>🕒</span>
              <span>Reply Within 24 Hours</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Our legal office is reviewing your matter details and will provide a response within <strong>24 hours</strong>.
            </p>
          </div>

          <div className="bg-[#2a1717] border border-red-900/60 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-xs sm:text-sm">
              <span>⚡</span>
              <span>Urgent Legal Requirement?</span>
            </div>
            <p className="text-xs text-red-200/90 leading-normal">
              If your legal matter requires immediate court action, urgent bail representation, or same-day attention, please call our advocate office directly:
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={`tel:${normalizePhoneNumber(phoneNumber)}`}
            className="w-full sm:flex-1 bg-[#b8955d] hover:bg-[#a3824e] text-[#17253d] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl text-center shadow transition"
          >
            📞 Call Directly ({phoneNumber})
          </a>
          <button
            type="button"
            onClick={closeModal}
            className="w-full sm:w-auto bg-[#20314f] hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-slate-600 transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
