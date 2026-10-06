import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Legal Resources", description: "Browse Nyaycast legal guides, printable checklists, and consultation preparation resources.", alternates: { canonical: "/resources" } };

const resources = [
  { href: "/guides", label: "Legal guides", detail: "Search judgment explainers in English and Gujarati." },
  { href: "/resources/checklists", label: "Preparation checklists", detail: "Printable property and contract document lists." },
  { href: "/resources/consultation-preparation", label: "Consultation preparation", detail: "A private checklist with no matter details collected." },
  { href: "/newsletter", label: "Nyaycast monthly updates", detail: "Optional email updates with confirmed opt-in." },
];

export default function ResourcesPage() {
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16"><header className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Nyaycast · Knowledge & tools</p><h1 className="mt-3 font-serif text-4xl text-[#17253d]">Legal resources</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">General legal information and practical preparation tools from Manas A. Agravat & Associates.</p></header><div className="mt-10 grid gap-x-8 md:grid-cols-2">{resources.map((resource, index) => <Link key={resource.href} href={resource.href} className="group border-t border-[#17253d]/20 py-6"><span className="text-xs font-semibold text-[#986f35]">0{index + 1}</span><h2 className="mt-2 font-serif text-2xl text-[#17253d] group-hover:text-[#986f35]">{resource.label} ↗</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{resource.detail}</p></Link>)}</div></div>;
}