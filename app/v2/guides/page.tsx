import type { Metadata } from "next";
import { GuideLibrary } from "@/components/v2/guide-library";

export const metadata: Metadata = { title: "Legal Guides · V2 Preview", robots: { index: false, follow: false } };

export default function GuidesPage() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Judgment notes</p><h1 className="mt-3 font-serif text-4xl">Legal guide library</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">Concise educational explainers with case citations. The Gujarati versions are drafts pending legal and language review.</p></div>
      <GuideLibrary />
    </div>
  );
}