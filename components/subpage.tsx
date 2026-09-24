import Image from "next/image";
import Link from "next/link";
import { SiteMotion } from "@/components/site-motion";
import { DisclaimerGate } from "@/components/disclaimer-gate";
import { ConsultationForm } from "@/components/consultation-form";
import { ConsultationModal } from "@/components/consultation-modal";
import { SiteHeader } from "@/components/site-header";
import type { SiteContent } from "@/lib/site-content";
import { normalizePhoneNumber } from "@/lib/common";

type Kind = "about" | "services" | "team" | "nyaycast" | "contact";
export function Subpage({ site, kind }: { site: SiteContent; kind: Kind }) {
  const title =
    kind === "about"
      ? "A Legal Guide Who Listens."
      : kind === "services"
        ? "Built Around Your Case."
        : kind === "team"
          ? "A Committed Team, By Your Side."
          : kind === "nyaycast"
            ? "Legal Updates & Knowledge."
            : "Let’s Discuss What Comes Next.";

  return (
    <div className="min-h-screen flex flex-col justify-between flex-1 bg-[#f8f6f0] text-[#17253d] font-sans selection:bg-[#b8955d]/20">
      <DisclaimerGate />
      <ConsultationModal phone={site.phone} />
      <SiteMotion />

      <SiteHeader site={site} activeRoute={`/${kind}`} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Header */}
        <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-8 space-y-2">
          {kind === "nyaycast" ? (
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                <Image src="/images/nyaycast-logo.png" alt="NyayCast Logo" fill className="object-contain" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d] block">
                  NYAYCAST · Nyay In Every Steps
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif text-[#17253d] tracking-tight">
                  {title}
                </h1>
              </div>
            </div>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                Manas A. Agravat & Associates
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#17253d] tracking-tight">
                {title}
              </h1>
            </>
          )}
        </div>

        {/* Section Body */}
        <section className="pb-20 max-w-6xl mx-auto px-4 sm:px-8">
          {kind === "about" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#b8955d]">
                  Advocate in {site.city}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#17253d]">{site.aboutTitle}</h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{site.aboutDescription}</p>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
                  <Image
                    src={site.aboutImage || "/images/manas-agravat.jpg"}
                    alt="Advocate Manas A. Agravat"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {kind === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.services.map((service, index) => (
                <div key={service.title} className="legal-card rounded-2xl p-6 space-y-3">
                  <span className="text-[#b8955d] font-mono text-xs font-semibold">
                    0{index + 1}
                  </span>
                  <h3 className="text-xl font-serif text-[#17253d] font-semibold">{service.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          )}

          {kind === "team" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.team.map((member, index) => (
                <div key={member.name} className="legal-card rounded-2xl p-5 space-y-4 text-center">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    ) : index === 0 ? (
                      <Image src="/images/manas-agravat.jpg" alt={member.name} fill className="object-cover" />
                    ) : index === 1 ? (
                      <Image src="/images/rajit-parekh.jpg" alt={member.name} fill className="object-cover" />
                    ) : (
                      <Image src="/images/jainam-shah.jpg" alt={member.name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#b8955d] block">
                      {member.role}
                    </span>
                    <h3 className="text-lg font-serif text-[#17253d] font-semibold mt-0.5">{member.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {kind === "nyaycast" && (
            <div className="space-y-10">
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                {site.nyaycastDescription}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {site.articles.map((article) => (
                  <div key={article.title} className="legal-card rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#b8955d]">
                        {article.category}
                      </span>
                      <h3 className="text-base font-serif font-semibold text-[#17253d] leading-snug">{article.title}</h3>
                    </div>
                    <Link
                      href={article.href || "#"}
                      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#17253d] hover:text-[#b8955d] pt-2"
                    >
                      <span>Read update</span>
                      <span>↗</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {kind === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
              <div className="lg:col-span-4 space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  For legal consultation, share a brief overview of your matter. We aim to respond within 1 business day.
                </p>
                <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-2 text-xs">
                  <p>
                    <b>Phone:</b>{" "}
                    <a href={`tel:${normalizePhoneNumber(site.phone)}`} className="hover:text-[#b8955d]">
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    <b>Email:</b>{" "}
                    <a href={`mailto:${site.email}`} className="hover:text-[#b8955d]">
                      {site.email}
                    </a>
                  </p>
                  <p><b>Hours:</b> {site.officeHours}</p>
                </div>
              </div>

              <div className="lg:col-span-6">
                <ConsultationForm />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ─── Sticky Bottom Footer with Contact & Social Navigation ─── */}
      <footer className="mt-auto bg-[#101b2d] border-t border-slate-800 py-10 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white border border-[#b8955d]/40 flex items-center justify-center p-0.5">
              <Image src="/images/manas-logo.png" alt="Manas Logo" fill className="object-contain" sizes="28px" />
            </div>
            <p>© {new Date().getFullYear()} Manas A. Agravat & Associates. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={site.socials?.whatsapp || "https://wa.me/919978844826"} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8955d] transition">
              WhatsApp
            </a>
            <a href={site.socials?.linkedin || "https://www.linkedin.com/in/manasagravat"} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8955d] transition">
              LinkedIn
            </a>
            <a href={site.socials?.facebook || "https://www.facebook.com/advocate.manasagravat"} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8955d] transition">
              Facebook
            </a>
            <a href={site.socials?.instagram || "https://www.instagram.com/adv.manasagravat"} target="_blank" rel="noopener noreferrer" className="hover:text-[#b8955d] transition">
              Instagram
            </a>
            <Link href="/" className="text-[#b8955d] hover:underline ml-2">
              Back to Homepage ↑
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
