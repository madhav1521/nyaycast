import { Subpage } from "@/components/subpage";
import { getSiteContent } from "@/lib/site-content";
export default async function ServicesPage() {
  return <Subpage site={await getSiteContent()} kind="services" />;
}
