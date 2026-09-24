import { Subpage } from "@/components/subpage";
import { getSiteContent } from "@/lib/site-content";
export default async function TeamPage() {
  return <Subpage site={await getSiteContent()} kind="team" />;
}
