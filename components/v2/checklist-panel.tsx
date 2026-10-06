"use client";

import { useState } from "react";
import type { checklists } from "@/lib/v2-checklists";

type Checklist = (typeof checklists)[keyof typeof checklists];

export function ChecklistPanel({ kind, checklist }: { kind: "property" | "contract"; checklist: Checklist }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const totalItems = checklist.groups.reduce((count, group) => count + group.items.length, 0);
  const completed = Object.values(checked).filter(Boolean).length;

  return (
    <article className="border-t-2 border-[#17253d] pt-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-wider text-[#986f35]">{kind === "property" ? "Property" : "Contracts"}</p><h2 className="mt-2 font-serif text-2xl">{checklist.title}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{checklist.description}</p></div>
        <span className="text-xs tabular-nums text-slate-500">{completed} / {totalItems} checked</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <a href={`/api/checklists/${kind}`} className="bg-[#17253d] px-4 py-2.5 text-xs font-semibold text-white">Download checklist</a>
        <button type="button" onClick={() => window.print()} className="border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-[#17253d]">Print / save as PDF</button>
        <button type="button" onClick={() => setChecked({})} className="px-3 py-2.5 text-xs text-slate-600 underline">Clear checks</button>
      </div>
      <div className="mt-6 space-y-6">
        {checklist.groups.map((group, groupIndex) => (
          <section key={group.title} className="border-t border-[#17253d]/15 pt-4">
            <h3 className="font-serif text-lg">{group.title}</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.items.map((item, itemIndex) => {
                const key = `${groupIndex}-${itemIndex}`;
                return <label key={key} className="flex items-start gap-3 border-b border-slate-200/70 py-2 text-sm leading-relaxed text-slate-700"><input type="checkbox" checked={!!checked[key]} onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))} className="mt-1 size-4 accent-[#17253d] print:hidden" /><span className="hidden size-4 border border-slate-500 print:inline-block" aria-hidden="true" />{item}</label>;
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}