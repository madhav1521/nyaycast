"use client";

import { useState } from "react";

const prepSections = [
  { title: "Documents you may want nearby", items: ["Bring copies of relevant notices, agreements, orders, or correspondence", "Arrange documents in date order if that is useful", "Keep originals secure unless you have been asked to bring them"] },
  { title: "Questions to consider", items: ["What would you like to understand or decide after the meeting?", "Are there any upcoming dates or deadlines you should mention in person?", "What steps have already been taken, and when?"] },
  { title: "Practical arrangements", items: ["Confirm the meeting time and location", "Allow time to explain the sequence of events clearly", "Ask which additional documents may be needed after the first discussion"] },
];

export function ConsultationPrep() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const itemCount = prepSections.reduce((sum, section) => sum + section.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="max-w-4xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#17253d]/15 py-4"><p className="text-sm text-slate-600">Temporary checklist · {checkedCount} of {itemCount} checked</p><button type="button" onClick={() => setChecked({})} className="border border-slate-300 px-3 py-2 text-xs font-semibold">Clear checklist</button></div>
      {prepSections.map((section, sectionIndex) => <section key={section.title} className="border-b border-[#17253d]/15 pb-5"><h2 className="font-serif text-2xl">{section.title}</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{section.items.map((item, itemIndex) => { const key = `${sectionIndex}-${itemIndex}`; return <label key={key} className="flex items-start gap-3 py-2 text-sm leading-relaxed text-slate-700"><input type="checkbox" checked={!!checked[key]} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} className="mt-1 size-4 accent-[#17253d]" />{item}</label>; })}</div></section>)}
      <aside className="border-l-4 border-amber-700 bg-white px-5 py-4 text-sm leading-relaxed text-slate-700"><strong>This is not legal advice.</strong> The checklist does not assess your situation, predict an outcome, or create an advocate-client relationship. Do not enter names, case details, or other confidential information here. Selections stay temporarily in this page and are not sent to the server or saved after you leave.</aside>
      <p className="text-xs text-slate-500">For urgent deadlines or immediate safety concerns, contact the appropriate authority or a qualified professional promptly; this website is not an emergency service.</p>
    </div>
  );
}