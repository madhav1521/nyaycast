import type { Metadata } from "next";
import { ConsultationPrep } from "@/components/v2/consultation-prep";

export const metadata: Metadata = { title: "Consultation Preparation · V2 Preview", robots: { index: false, follow: false } };

export default function ConsultationPreparationPage() {
  return <div className="space-y-8"><header className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Private preparation</p><h1 className="mt-3 font-serif text-4xl">Make space for a clear conversation.</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">Use this temporary checklist to organize generic preparation. It does not ask for or store details about your matter.</p></header><ConsultationPrep /></div>;
}