import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "V2 Preview",
  description: "Local preview of legal guides and visitor resources.",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <div className="min-h-screen bg-[#f8f6f0] text-[#17253d]">
      <div className="border-b border-amber-700/30 bg-[#17253d] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-300">Local development preview · V2 not live</p>
          <Link href="/" className="text-xs text-white underline decoration-amber-400 underline-offset-4">Return to V1 site</Link>
        </div>
      </div>
      <header className="border-b border-[#17253d]/10 bg-[#f8f6f0]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <Link href="/v2" className="font-serif text-xl font-semibold">Nyaycast <span className="text-[#986f35]">/ V2</span></Link>
          <nav aria-label="V2 preview navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-700">
            <Link href="/v2/guides">Guides</Link>
            <Link href="/v2/newsletter">Monthly updates</Link>
            <Link href="/v2/checklists">Checklists</Link>
            <Link href="/v2/prepare">Prepare for a consultation</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">{children}</main>
      <footer className="border-t border-[#17253d]/15 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>General information only; not legal advice and no advocate-client relationship is created.</p>
          <Link href="/v2/guides">Browse legal guides</Link>
        </div>
      </footer>
    </div>
  );
}