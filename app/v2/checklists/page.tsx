import type { Metadata } from "next";
import { checklists } from "@/lib/v2-checklists";
import { ChecklistPanel } from "@/components/v2/checklist-panel";

export const metadata: Metadata = { title: "Preparation Checklists · V2 Preview", robots: { index: false, follow: false } };

export default function ChecklistsPage() {
  return (
    <div className="space-y-12 print:max-w-none">
      <header className="max-w-3xl print:hidden"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Printable resources</p><h1 className="mt-3 font-serif text-4xl">Bring the right questions.</h1><p className="mt-3 text-sm leading-relaxed text-slate-600">These general lists can help organize a conversation. They are not exhaustive and do not replace checking the requirements for a specific transaction or jurisdiction.</p></header>
      <div className="space-y-12"><ChecklistPanel kind="property" checklist={checklists.property} /><ChecklistPanel kind="contract" checklist={checklists.contract} /></div>
      <p className="border-t border-[#17253d]/15 pt-5 text-xs leading-relaxed text-slate-500">Document requirements vary with the transaction and applicable law. This material is general information only, not legal advice, and does not create an advocate-client relationship.</p>
      <style>{"@media print { header, footer, nav, .print\\:hidden { display: none !important; } body { background: white !important; } main { max-width: none !important; padding: 0 !important; } article { break-inside: avoid; } }"}</style>
    </div>
  );
}