import Link from "next/link";
import Image from "next/image";
import { getSiteContent } from "@/lib/site-content";
import { DisclaimerGate } from "@/components/disclaimer-gate";
import { SiteMotion } from "@/components/site-motion";
import { ConsultationForm } from "@/components/consultation-form";
import { ConsultationModal } from "@/components/consultation-modal";
import { SiteHeader } from "@/components/site-header";
import { normalizePhoneNumber } from "@/lib/common";

export default async function Home() {
  const site = await getSiteContent();

  const practiceIcons = [
    // Civil & Property
    <svg key="1" className="w-5 h-5 text-[#b8955d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0v10" />
    </svg>,
    // Criminal Defence
    <svg key="2" className="w-5 h-5 text-[#b8955d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    // Corporate & Contracts
    <svg key="3" className="w-5 h-5 text-[#b8955d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>,
    // Family & Consumer
    <svg key="4" className="w-5 h-5 text-[#b8955d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>,
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between flex-1 bg-[#f8f6f0] text-[#17253d] font-sans selection:bg-[#b8955d]/20">
      <DisclaimerGate />
      <ConsultationModal phone={site.phone} />
      <SiteMotion />

      {/* Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            name: site.firmName,
            description: site.heroDescription,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.address,
              addressLocality: site.city,
              addressRegion: "Gujarat",
              addressCountry: "IN",
            },
            telephone: site.phone,
            email: site.email,
            areaServed: "Ahmedabad",
          }),
        }}
      />

      <SiteHeader site={site} homePage />

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section id="home" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eee8de] border border-[#17253d]/10 text-xs font-semibold tracking-wider text-[#b8955d] uppercase">
                <span>Advocate · {site.city} · Est. 2012</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#17253d] leading-snug tracking-tight">
                {site.heroTitle}
                <br />
                <em className="italic text-[#b8955d] font-serif">{site.heroAccent}</em>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
                {site.heroDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="#consultation"
                  className="inline-flex items-center gap-2 bg-[#17253d] hover:bg-[#20314f] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-lg shadow transition"
                >
                  <span>Book Consultation</span>
                  <span>↗</span>
                </Link>
                <Link
                  href="#services"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#17253d] border border-slate-300 text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-lg transition"
                >
                  <span>Explore Practice Areas</span>
                  <span>↓</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg aspect-[4/5] bg-white">
                <Image
                  src={site.aboutImage || "/images/manas-agravat.jpg"}
                  alt="Advocate Manas A. Agravat"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17253d]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 space-y-1 shadow-md">
                  <h3 className="font-serif font-semibold text-[#17253d] text-base">Adv. Manas A. Agravat</h3>
                  <p className="text-xs text-slate-600">Civil, Criminal & High Court Legal Representation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust Metrics Strip ─── */}
        <section className="bg-white border-y border-slate-200/80 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-slate-100 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#17253d]">15+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
                Years Legal Practice
              </div>
            </div>
            <div className="border-r border-slate-100 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#b8955d]">1,200+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
                Matters Represented
              </div>
            </div>
            <div className="border-r border-slate-100 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#17253d]">98%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
                Client Resolution Rate
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#b8955d]">100%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mt-1">
                Confidential Representation
              </div>
            </div>
          </div>
        </section>

        {/* ─── About Section ─── */}
        <section id="about" className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[3/4] bg-white">
                <Image
                  src={site.whyImage || "/images/legal-consulting.jpg"}
                  alt="Legal advocate consultation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                  01 / ABOUT THE FIRM
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#17253d] tracking-tight">
                  {site.aboutTitle}
                </h2>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {site.aboutDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {site.strengths.map((strength) => (
                  <div key={strength} className="flex items-start gap-2.5 bg-white border border-slate-200/80 p-3 rounded-xl shadow-xs">
                    <span className="text-[#b8955d] text-sm">✦</span>
                    <span className="text-slate-700 text-xs font-medium">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Services / Practice Areas ─── */}
        <section id="services" className="py-20 bg-[#eee8de]/60 border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-300/60 pb-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                  02 / PRACTICE AREAS
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#17253d] tracking-tight">
                  Focused Practice Areas
                </h2>
              </div>
              <Link
                href="/services"
                className="text-xs font-semibold uppercase tracking-wider text-[#17253d] hover:text-[#b8955d] transition"
              >
                View All Services ↗
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.services.map((service, index) => (
                <div key={service.title} className="legal-card rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f6f0] border border-slate-200 flex items-center justify-center">
                      {practiceIcons[index % practiceIcons.length]}
                    </div>
                    <span className="text-slate-400 font-mono text-xs font-semibold">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#17253d] font-semibold">{service.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Team Section ─── */}
        <section id="team" className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="space-y-12">
            <div className="space-y-1 text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                03 / OUR TEAM
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#17253d]">
                Dedicated Advocates & Staff
              </h2>
            </div>

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
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <section className="py-20 bg-white border-t border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-10">
            <div className="space-y-1 text-center max-w-xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                CLIENT FEEDBACK
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#17253d]">
                Client Testimonials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {site.testimonials.map((t) => (
                <div key={t.name} className="bg-[#f8f6f0] border border-slate-200 p-6 rounded-2xl space-y-3">
                  <div className="text-[#b8955d] text-xs">★★★★★</div>
                  <blockquote className="text-slate-700 text-sm font-serif italic leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#17253d]">
                    — {t.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Nyaycast Updates Section ─── */}
        <section id="updates" className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-300/60 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                    <Image
                      src="/images/nyaycast-logo.png"
                      alt="NyayCast Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                      04 / NYAYCAST
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#17253d]">
                      NyayIn Every Steps
                    </h2>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md">
                {site.nyaycastDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {site.articles.map((a) => (
                <div key={a.title} className="legal-card rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#b8955d]">
                      {a.category}
                    </span>
                    <h3 className="text-base font-serif font-semibold text-[#17253d] leading-snug">{a.title}</h3>
                  </div>
                  <Link
                    href={a.href || "#updates"}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#17253d] hover:text-[#b8955d] pt-2"
                  >
                    <span>Read update</span>
                    <span>↗</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Consultation Form Section ─── */}
        <section id="consultation" className="py-20 bg-[#17253d] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8955d]">
                START A CONVERSATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                Request a Consultation
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Tell us about your legal matter. Our advocate office will review your request and get back to you within 1 business day.
              </p>

              <div className="pt-4 border-t border-slate-700/80 space-y-2 text-xs text-slate-300">
                <p>
                  <b>Phone:</b>{" "}
                  <a href={`tel:${normalizePhoneNumber(site.phone)}`} className="hover:text-[#b8955d] transition">
                    {site.phone}
                  </a>
                </p>
                <p>
                  <b>Email:</b>{" "}
                  <a href={`mailto:${site.email}`} className="hover:text-[#b8955d] transition">
                    {site.email}
                  </a>
                </p>
                <p><b>Hours:</b> {site.officeHours}</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ConsultationForm />
            </div>
          </div>
        </section>
      </main>

      {/* ─── Sticky Bottom Footer with Contact & Social Navigation ─── */}
      <footer className="mt-auto bg-[#101b2d] border-t border-slate-800 py-10 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-[#b8955d]/40 flex items-center justify-center p-0.5">
                <Image src="/images/manas-logo.png" alt="Manas Logo" fill className="object-contain" />
              </div>
              <span className="font-serif font-semibold text-white text-base block">{site.firmName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">{site.address}</p>

            {/* Social Account Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={site.socials?.whatsapp || "https://wa.me/919978844826"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#20314f] hover:bg-[#b8955d] hover:text-[#17253d] text-white flex items-center justify-center transition border border-slate-700/60"
                title="WhatsApp Direct Chat"
              >
                💬
              </a>
              <a
                href={site.socials?.linkedin || "https://www.linkedin.com/in/manasagravat"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#20314f] hover:bg-[#b8955d] hover:text-[#17253d] text-white flex items-center justify-center transition border border-slate-700/60"
                title="LinkedIn Profile"
              >
                in
              </a>
              <a
                href={site.socials?.facebook || "https://www.facebook.com/advocate.manasagravat"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#20314f] hover:bg-[#b8955d] hover:text-[#17253d] text-white flex items-center justify-center transition border border-slate-700/60"
                title="Facebook Page"
              >
                fb
              </a>
              <a
                href={site.socials?.instagram || "https://www.instagram.com/adv.manasagravat"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#20314f] hover:bg-[#b8955d] hover:text-[#17253d] text-white flex items-center justify-center transition border border-slate-700/60"
                title="Instagram"
              >
                ig
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-white uppercase text-[10px] tracking-wider block">Contact Us</span>
            <p className="space-y-1 text-slate-300">
              <a href={`tel:${normalizePhoneNumber(site.phone)}`} className="hover:text-[#b8955d] transition block">
                📞 {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="hover:text-[#b8955d] transition block">
                ✉️ {site.email}
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-white uppercase text-[10px] tracking-wider block">Office Hours</span>
            <p className="text-slate-300">{site.officeHours}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
