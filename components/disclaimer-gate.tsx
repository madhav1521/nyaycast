"use client";

import { useEffect, useState } from "react";

const storageKey = "manas-disclaimer-agreed";

export function DisclaimerGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const isAgreed = localStorage.getItem(storageKey) === "true";
      if (!isAgreed) {
        setOpen(true);
        document.body.style.overflow = "hidden";
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function agree() {
    localStorage.setItem(storageKey, "true");
    document.body.style.overflow = "";
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="bg-[#17253d] text-white border border-[#b8955d]/50 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative font-sans text-left">
        {/* Header */}
        <div className="space-y-1.5 border-b border-slate-700/80 pb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b8955d] block">
            BAR COUNCIL OF INDIA COMPLIANCE NOTICE
          </span>
          <h2 id="disclaimer-title" className="text-xl sm:text-2xl font-serif text-white font-semibold">
            Disclaimer & Terms of Access
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p>
            As per the rules of the <strong>Bar Council of India</strong> and the <strong>Advocates Act, 1961</strong>, advocates and law offices are strictly prohibited from soliciting work or advertising in any manner.
          </p>

          <p>
            By clicking <strong className="text-white">&quot;I Agree & Enter Website&quot;</strong> below, you acknowledge and confirm the following:
          </p>

          <ul className="space-y-2 bg-[#20314f] border border-slate-700/80 p-4 rounded-xl text-xs text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-[#b8955d] text-sm">✦</span>
              <span>
                You are seeking information about Advocate Manas A. Agravat & Associates voluntarily for your own knowledge and personal use.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#b8955d] text-sm">✦</span>
              <span>
                There has been no advertisement, personal communication, solicitation, invitation, or inducement of any kind by Adv. Manas A. Agravat or his team.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#b8955d] text-sm">✦</span>
              <span>
                The information provided on this website is for general informational purposes only and does not constitute legal advice or establish an advocate-client relationship.
              </span>
            </li>
          </ul>

          <p className="text-[11px] text-slate-400 font-light">
            For specific legal opinions or representation regarding your matter, you must schedule a formal consultation with our office.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={agree}
            autoFocus
            className="w-full bg-[#b8955d] hover:bg-[#a3824e] text-[#17253d] font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl shadow-xl transition transform active:scale-[0.98] cursor-pointer"
          >
            I Agree & Enter Website ↗
          </button>
        </div>
      </div>
    </div>
  );
}
