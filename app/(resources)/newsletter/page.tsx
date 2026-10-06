import type { Metadata } from "next";
import { NewsletterForm } from "@/components/v2/newsletter-form";

export const metadata: Metadata = { title: "Nyaycast Monthly Updates", description: "Optional monthly legal-information updates from Nyaycast.", alternates: { canonical: "/newsletter" } };

export default function NewsletterPage() {
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16"><div className="max-w-3xl space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Nyaycast · Optional email updates</p><h1 className="font-serif text-4xl text-[#17253d]">A thoughtful note, about once a month.</h1><p className="text-sm leading-relaxed text-slate-600">Nyaycast updates share general legal-information articles and selected judgment explainers. They are not legal advice, and subscribing does not create an advocate-client relationship.</p><NewsletterForm /></div></div>;
}