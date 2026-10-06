"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { legalGuides, guideLabels, type GuideLanguage } from "@/lib/v2-guides";

export function GuideLibrary() {
  const [language, setLanguage] = useState<GuideLanguage>("en");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const labels = guideLabels[language];
  const categories = [...new Set(legalGuides.map((guide) => guide.category))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return legalGuides.filter((guide) => {
      const copy = guide[language];
      return (category === "all" || guide.category === category) &&
        (!normalized || `${copy.title} ${copy.summary} ${guide.citation} ${copy.tags.join(" ")}`.toLocaleLowerCase().includes(normalized));
    });
  }, [category, language, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#17253d]/15 pb-5">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{labels.intro}</p>
        <div className="inline-flex border border-[#17253d]/20 p-1" aria-label="Guide language">
          <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")} className={`px-3 py-2 text-xs font-semibold ${language === "en" ? "bg-[#17253d] text-white" : "text-[#17253d]"}`}>English</button>
          <button type="button" aria-pressed={language === "gu"} onClick={() => setLanguage("gu")} className={`px-3 py-2 text-xs font-semibold ${language === "gu" ? "bg-[#17253d] text-white" : "text-[#17253d]"}`}>ગુજરાતી</button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="guide-search">{labels.search}</label>
        <input id="guide-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={labels.search} className="min-w-0 border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#b8955d]" />
        <label className="sr-only" htmlFor="guide-category">{labels.all}</label>
        <select id="guide-category" value={category} onChange={(event) => setCategory(event.target.value)} className="border border-slate-300 bg-white px-4 py-3 text-sm text-[#17253d]">
          <option value="all">{labels.all}</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        {filtered.map((guide) => (
          <article key={guide.slug} className="border-t border-[#17253d]/15 py-6 md:px-6 md:odd:border-r md:odd:pl-0 md:even:pr-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#986f35]">{language === "gu" ? guide.gu.tags[0] : guide.category} · {guide.year}</p>
            <h2 lang={language} className={`mt-3 font-serif text-2xl leading-tight text-[#17253d] ${language === "gu" ? "font-gujarati" : ""}`}>{guide[language].title}</h2>
            <p lang={language} className="mt-3 text-sm leading-relaxed text-slate-600">{guide[language].summary}</p>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{guide.citation}</p>
            <Link href={`/guides/${guide.slug}?lang=${language}`} className="mt-5 inline-flex items-center gap-2 border-b border-[#b8955d] pb-1 text-xs font-semibold text-[#17253d] hover:text-[#986f35]">{labels.read}<span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>
      {filtered.length === 0 && <p className="border-t border-[#17253d]/15 py-8 text-sm text-slate-600">No guides match that search.</p>}
      <p className="border-t border-[#17253d]/15 pt-5 text-xs leading-relaxed text-slate-500">{labels.disclaimer}</p>
    </div>
  );
}