import { notFound } from "next/navigation";
import { checklists, type ChecklistKind } from "@/lib/v2-checklists";

export const dynamic = "force-dynamic";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

export async function GET(_request: Request, context: RouteContext<"/api/checklists/[kind]">) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { kind } = await context.params;
  if (kind !== "property" && kind !== "contract") notFound();
  const checklist = checklists[kind as ChecklistKind];
  const sections = checklist.groups.map((group) => `<section><h2>${escapeHtml(group.title)}</h2><ul>${group.items.map((item) => `<li><span class="box"></span>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("");
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(checklist.title)}</title><style>body{font:16px/1.55 Georgia,serif;color:#17253d;max-width:780px;margin:40px auto;padding:0 24px}h1{font-size:32px}h2{font-size:20px;border-top:1px solid #bbb;padding-top:16px;margin-top:28px}li{list-style:none;margin:12px 0;display:flex;gap:10px}.box{width:15px;height:15px;border:1px solid #555;flex:none;margin-top:4px}.note{border-top:1px solid #bbb;padding-top:14px;margin-top:28px;font:13px/1.5 Arial,sans-serif;color:#555}@media print{body{margin:0 auto;padding:0 10mm}}</style><body><h1>${escapeHtml(checklist.title)}</h1><p>${escapeHtml(checklist.description)}</p>${sections}<p class="note">General information only, not legal advice. Requirements depend on the transaction and applicable law. This checklist does not create an advocate-client relationship.</p></body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${checklist.fileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}