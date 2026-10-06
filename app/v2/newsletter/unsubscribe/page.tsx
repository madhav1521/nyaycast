import type { Metadata } from "next";
import { NewsletterForm } from "@/components/v2/newsletter-form";

export const metadata: Metadata = { title: "Unsubscribe from Nyaycast", robots: { index: false, follow: false } };
export default function NewsletterUnsubscribePage() {
  return <div className="max-w-xl space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Email preferences</p><h1 className="font-serif text-4xl">Stop monthly updates</h1><p className="text-sm leading-relaxed text-slate-600">Confirm below to remove this address from Nyaycast updates.</p><NewsletterForm action="unsubscribe" /></div>;
}