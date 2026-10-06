import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { legalGuides, guideLabels, type GuideLanguage } from "@/lib/v2-guides";

type GuidePageProps = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = legalGuides.find((item) => item.slug === slug);
  if (!guide) return { title: "Guide not found" };
  return { title: guide.en.title, description: guide.en.summary, alternates: { canonical: `/guides/${guide.slug}` } };
}

export default async function GuideDetailPage({ params, searchParams }: GuidePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const guide = legalGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const language: GuideLanguage = query.lang === "gu" ? "gu" : "en";
  const copy = guide[language];
  const labels = guideLabels[language];

  return (
    <article lang={language} className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
      <Link href={`/guides?lang=${language}`} className="text-xs font-semibold text-[#986f35] hover:underline">← {labels.back}</Link>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#986f35]">{language === "gu" ? copy.tags[0] : guide.category} · {guide.year}</p><div className="flex gap-2 text-xs"><Link href="?lang=en" aria-current={language === "en" ? "page" : undefined} className={`border px-3 py-2 ${language === "en" ? "border-[#17253d] bg-[#17253d] text-white" : "border-slate-300"}`}>English</Link><Link href="?lang=gu" aria-current={language === "gu" ? "page" : undefined} className={`border px-3 py-2 ${language === "gu" ? "border-[#17253d] bg-[#17253d] text-white" : "border-slate-300"}`}>ગુજરાતી</Link></div></div>
      <h1 className={`mt-5 font-serif text-4xl leading-tight text-[#17253d] ${language === "gu" ? "font-gujarati" : ""}`}>{copy.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-600">{copy.summary}</p>
      <dl className="mt-8 border-y border-[#17253d]/15 py-4 text-sm"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">{labels.citation}</dt><dd className="mt-1">{guide.citation} · {guide.court}</dd></dl>
      <div className="space-y-8 py-8"><section><h2 className="font-serif text-2xl">{labels.principle}</h2><p className="mt-3 text-sm leading-7 text-slate-700">{copy.principle}</p></section><section><h2 className="font-serif text-2xl">{labels.context}</h2><p className="mt-3 text-sm leading-7 text-slate-700">{copy.context}</p></section><section><h2 className="font-serif text-2xl">{labels.practical}</h2><p className="mt-3 text-sm leading-7 text-slate-700">{copy.practical}</p></section></div>
      <a href={guide.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex border-b border-[#b8955d] pb-1 text-xs font-semibold text-[#17253d] hover:text-[#986f35]">{labels.source} ↗</a>
      {language === "gu" && <p className="mt-6 border-l-2 border-amber-600 pl-4 text-xs leading-relaxed text-slate-600">{labels.review}</p>}
      <p className="mt-8 border-t border-[#17253d]/15 pt-5 text-xs leading-relaxed text-slate-500">{labels.disclaimer}</p>
    </article>
  );
}