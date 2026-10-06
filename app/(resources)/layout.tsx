import type { Metadata } from "next";
import { ConsultationModal } from "@/components/consultation-modal";
import { DisclaimerGate } from "@/components/disclaimer-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteMotion } from "@/components/site-motion";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Legal Guides & Resources",
  description: "Plain-language legal guides, practical checklists, and Nyaycast updates.",
};

export default async function ResourcesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteContent();
  return (
    <div className="min-h-screen flex flex-col flex-1 bg-[#f8f6f0] text-[#17253d] font-sans selection:bg-[#b8955d]/20">
      <DisclaimerGate />
      <ConsultationModal phone={site.phone} />
      <SiteMotion />
      <SiteHeader site={site} activeRoute="/resources" />
      <main className="flex-1">{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}