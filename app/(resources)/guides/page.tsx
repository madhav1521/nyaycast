import type { Metadata } from "next";
import { GuideLibrary } from "@/components/v2/guide-library";

export const metadata: Metadata = {
  title: "Legal Guides",
  description: "Search plain-language explainers of selected Indian judgments in English and Gujarati.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-8 sm:py-16">
      <div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Nyaycast · Judgment notes</p><h1 className="mt-3 font-serif text-4xl text-[#17253d]">Legal guide library</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">Concise educational explainers with case citations. Gujarati versions are drafts and must be reviewed by qualified legal and language editors before being treated as authoritative.</p></div>
      <GuideLibrary />
    </div>
  );
}