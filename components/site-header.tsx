import Image from "next/image";
import Link from "next/link";
import { ROUTES, SITE_NAVIGATION } from "@/constants/routes";
import { UI_MESSAGES } from "@/constants/messages";
import { MobileNav } from "@/components/mobile-nav";
import type { SiteContent } from "@/lib/site-content";

type SiteHeaderProps = {
  site: SiteContent;
  homePage?: boolean;
  activeRoute?: string;
};

export function SiteHeader({ site, homePage = false, activeRoute }: SiteHeaderProps) {
  const logoHref = homePage ? ROUTES.homeSection.home : ROUTES.home;
  const navigation = homePage
    ? SITE_NAVIGATION
    : SITE_NAVIGATION.map((item) => ({
        ...item,
        href: item.href === ROUTES.homeSection.about ? ROUTES.about : item.href,
      }));
  const consultationHref = homePage ? ROUTES.homeSection.consultation : ROUTES.contact;

  return (
    <header className="sticky top-0 z-50 bg-[#f8f6f0]/95 backdrop-blur-md border-b border-[#17253d]/10 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href={logoHref} className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-[#b8955d]/40 shadow-sm flex items-center justify-center p-0.5">
            <Image
              src="/images/manas-logo.png"
              alt="Manas A. Agravat Logo"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div>
            <span className="block font-serif font-semibold text-base text-[#17253d] leading-tight">
              {site.firmName}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#b8955d]">
              Advocate in {site.city}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-700" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-[#b8955d] transition ${activeRoute === item.href ? "text-[#b8955d]" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={consultationHref}
          className="hidden md:inline-flex items-center gap-1.5 bg-[#17253d] hover:bg-[#20314f] text-[#f8f6f0] font-semibold text-xs px-4 py-2 rounded-lg shadow-sm border border-[#b8955d]/30 transition"
        >
          <span>{UI_MESSAGES.bookConsultation}</span>
        </Link>
        <MobileNav items={navigation} ctaHref={consultationHref} activeHref={activeRoute} />
      </div>
    </header>
  );
}
