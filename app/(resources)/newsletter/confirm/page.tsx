import type { Metadata } from "next";
import { NewsletterForm } from "@/components/v2/newsletter-form";

export const metadata: Metadata = { title: "Confirm Nyaycast Updates", robots: { index: false, follow: false } };
export default function NewsletterConfirmPage() {
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16"><div className="max-w-xl space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Email confirmation</p><h1 className="font-serif text-4xl text-[#17253d]">Confirm your request</h1><p className="text-sm leading-relaxed text-slate-600">Press the button to confirm monthly Nyaycast updates. This link is valid for 24 hours.</p><NewsletterForm action="confirm" /></div></div>;
}