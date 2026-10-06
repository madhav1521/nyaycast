import type { Metadata } from "next";
import { NewsletterForm } from "@/components/v2/newsletter-form";

export const metadata: Metadata = { title: "Monthly Nyaycast Updates · V2 Preview", robots: { index: false, follow: false } };

export default function NewsletterPage() {
  return <div className="max-w-3xl space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Optional email updates</p><h1 className="font-serif text-4xl">A thoughtful note, about once a month.</h1><p className="max-w-2xl text-sm leading-relaxed text-slate-600">Nyaycast updates share general legal-information articles and selected judgment explainers. They are not legal advice, and subscribing does not create a lawyer-client relationship.</p><NewsletterForm /></div>;
}