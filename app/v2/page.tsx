import Link from "next/link";

export default function V2HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 border-b border-[#17253d]/15 pb-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#986f35]">Nyaycast · public legal education</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">Understand the law, one clear question at a time.</h1>
        </div>
        <p className="text-sm leading-relaxed text-slate-600 md:col-span-4">Explore carefully sourced judgment explainers, practical checklists, and a small tool to prepare for a conversation with counsel.</p>
      </section>
      <section className="grid gap-8 md:grid-cols-2">
        <Link href="/v2/guides" className="group border-t-2 border-[#b8955d] pt-5"><p className="text-xs uppercase tracking-wider text-[#986f35]">01 · Read</p><h2 className="mt-3 font-serif text-2xl group-hover:underline">Legal guides and judgments</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Search selected decisions in English or Gujarati.</p></Link>
        <Link href="/v2/checklists" className="group border-t-2 border-[#17253d] pt-5"><p className="text-xs uppercase tracking-wider text-[#986f35]">02 · Prepare</p><h2 className="mt-3 font-serif text-2xl group-hover:underline">Printable checklists</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Organize common property and contract questions.</p></Link>
        <Link href="/v2/prepare" className="group border-t-2 border-[#2a6e63] pt-5"><p className="text-xs uppercase tracking-wider text-[#986f35]">03 · Get ready</p><h2 className="mt-3 font-serif text-2xl group-hover:underline">Consultation preparation</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">A private, temporary checklist with no case-detail form.</p></Link>
        <Link href="/v2/newsletter" className="group border-t-2 border-[#8a4d4b] pt-5"><p className="text-xs uppercase tracking-wider text-[#986f35]">04 · Follow</p><h2 className="mt-3 font-serif text-2xl group-hover:underline">Monthly Nyaycast notes</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Optional email updates with confirmation and unsubscribe controls.</p></Link>
      </section>
    </div>
  );
}