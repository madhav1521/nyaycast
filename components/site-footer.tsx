import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import type { SiteContent } from "@/lib/site-content";

export function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#101b2d] py-10 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg border border-[#b8955d]/40 bg-white p-0.5">
            <Image src="/images/manas-logo.png" alt="Manas Logo" fill className="object-contain" sizes="28px" />
          </div>
          <p>© {new Date().getFullYear()} {site.firmName}. All rights reserved.</p>
        </div>
        <nav aria-label="Resource links" className="flex flex-wrap gap-x-5 gap-y-3">
          <Link href="/guides" className="hover:text-[#b8955d]">Legal guides</Link>
          <Link href="/resources/checklists" className="hover:text-[#b8955d]">Checklists</Link>
          <Link href="/newsletter" className="hover:text-[#b8955d]">Nyaycast updates</Link>
          <Link href="/resources/consultation-preparation" className="hover:text-[#b8955d]">Consultation preparation</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a href={site.socials?.whatsapp || "https://wa.me/919978844826"} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366] text-white" aria-label="WhatsApp"><FaWhatsapp className="h-4 w-4" /></a>
          <a href={site.socials?.linkedin || "https://www.linkedin.com/in/manas-agravat-6931b65195"} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A66C2] text-white" aria-label="LinkedIn"><FaLinkedinIn className="h-4 w-4" /></a>
          <a href={site.socials?.facebook || "https://www.facebook.com/agravat.manas"} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2] text-white" aria-label="Facebook"><FaFacebookF className="h-4 w-4" /></a>
          <a href={site.socials?.instagram || "https://www.instagram.com/nyaycast"} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white" aria-label="Instagram"><FaInstagram className="h-4 w-4" /></a>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-6xl border-t border-slate-700/70 px-4 pt-4 leading-relaxed text-slate-500 sm:px-8">The information on this website is general in nature, not legal advice, and does not create an advocate-client relationship.</p>
    </footer>
  );
}