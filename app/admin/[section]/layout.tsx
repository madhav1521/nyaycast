import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminSectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAdmin())) redirect("/admin");
  return children;
}
