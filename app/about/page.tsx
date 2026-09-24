import { Subpage } from "@/components/subpage";
import { getSiteContent } from "@/lib/site-content";
export default async function AboutPage() {
  return <Subpage site={await getSiteContent()} kind="about" />;
}
