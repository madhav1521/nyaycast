"use client";

import { useState } from "react";
import { API_MESSAGES, UI_MESSAGES } from "@/constants/messages";
import { getApiError, phoneDigits } from "@/lib/common";

export function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    form?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [success, setSuccess] = useState(false);

  function validate() {
    const errs: typeof errors = {};
    const nameTrim = formData.name.trim();
    const phoneTrim = formData.phone.trim();
    const emailTrim = formData.email.trim();
    const msgTrim = formData.message.trim();

    if (!nameTrim || nameTrim.length < 2) {
      errs.name = API_MESSAGES.fullNameRequired;
    }

    // Phone validation: min 10 digits/characters
    const digits = phoneDigits(phoneTrim);
    if (!phoneTrim || digits.length < 10) {
      errs.phone = API_MESSAGES.phoneInvalid;
    }

    if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      errs.email = API_MESSAGES.emailInvalid;
    }

    if (!msgTrim || msgTrim.length < 10) {
      errs.message = API_MESSAGES.matterRequired;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmittedName(formData.name.trim());
        setSubmittedPhone(formData.phone.trim());
        setSuccess(true);
        setFormData({ name: "", phone: "", email: "", message: "" });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("consultation-success"));
        }
      } else {
        setErrors({
          form: await getApiError(res, UI_MESSAGES.unableToSubmit),
        });
      }
    } catch {
      setErrors({ form: UI_MESSAGES.networkError });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#17253d] text-white p-6 sm:p-8 rounded-2xl border border-slate-700/60 shadow-xl">
      {success ? (
        <div className="space-y-4 py-4 text-center">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center text-2xl mx-auto">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif text-white font-semibold">
              Consultation Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-white">{submittedName}</strong>. Advocate Manas A. Agravat&apos;s office has received your legal inquiry and an email notification has been dispatched.
            </p>
            <p className="text-xs text-[#b8955d] font-medium bg-[#20314f] p-3 rounded-xl border border-slate-700/60">
              📞 Our advocate team will contact you at <span className="font-mono text-white">{submittedPhone}</span> within 1 business day.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="inline-flex items-center gap-1.5 bg-[#b8955d] hover:bg-[#a3824e] text-[#17253d] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-white">
              {UI_MESSAGES.consultationForm}
            </h3>
            <p className="text-xs text-slate-300">
              {UI_MESSAGES.consultationFormDescription}
            </p>
          </div>

          {errors.form && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3 rounded-lg">
              ⚠️ {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Your full name"
                disabled={submitting}
                className={`w-full bg-[#20314f] border rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b8955d] ${
                  errors.name ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="+91 98765 43210"
                disabled={submitting}
                className={`w-full bg-[#20314f] border rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b8955d] ${
                  errors.phone ? "border-red-500" : "border-slate-600"
                }`}
              />
              {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-300">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="name@example.com"
              disabled={submitting}
              className={`w-full bg-[#20314f] border rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b8955d] ${
                errors.email ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-300">
              Brief Legal Matter Summary *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                setFormData({ ...formData, message: e.target.value });
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              placeholder="Briefly describe your legal matter, property dispute, contract, or inquiry..."
              rows={4}
              disabled={submitting}
              className={`w-full bg-[#20314f] border rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b8955d] leading-relaxed ${
                errors.message ? "border-red-500" : "border-slate-600"
              }`}
            />
            {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#b8955d] hover:bg-[#a3824e] text-[#17253d] font-bold text-xs uppercase tracking-wider py-3 rounded-lg shadow transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#17253d] border-t-transparent rounded-full animate-spin" />
                Submitting Request…
              </>
            ) : (
              <>Request Consultation ↗</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
