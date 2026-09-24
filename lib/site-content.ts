import { neon } from "@neondatabase/serverless";

export const defaultSiteContent = {
  firmName: "Manas A. Agravat & Associates",
  city: "Ahmedabad",
  heroTitle: "Good counsel",
  heroAccent: "changes everything.",
  heroDescription:
    "Honest, skilled, and dedicated representation for the legal moments that matter most.",
  aboutTitle: "Personal attention. Purposeful action.",
  aboutDescription:
    "Adv. Manas A. Agravat is a practising advocate in Ahmedabad, offering clear, responsive counsel across civil, criminal, revenue, consumer, and corporate matters. Every case receives thoughtful preparation, candid guidance, and dedicated representation.",
  aboutImage: "/images/manas-agravat.jpg",
  whyImage: "/images/legal-signing.jpg",
  address:
    "801, 8th Floor, Ratnanjali Solitaire, Near Omkareshwar Mahadev Temple, Satellite, Ahmedabad – 380015, Gujarat, India.",
  phone: "+91 99788 44826",
  email: "manasagravat.adv@gmail.com",
  notificationEmail: "manas0812@yopmail.com",
  officeHours: "Monday to Saturday · 10:00 am to 8:00 pm",
  socials: {
    linkedin: "https://www.linkedin.com/in/manasagravat",
    facebook: "https://www.facebook.com/advocate.manasagravat",
    instagram: "https://www.instagram.com/adv.manasagravat",
    whatsapp: "https://wa.me/919978844826",
  },
  services: [
    {
      title: "Civil & Property Disputes",
      description: "Practical guidance for ownership, property disputes, and documentation.",
      image: undefined as string | undefined,
    },
    {
      title: "Criminal Law & Bail",
      description: "Responsive representation through criminal proceedings and bail applications.",
      image: undefined as string | undefined,
    },
    {
      title: "Revenue & Land Records",
      description: "Clarity and strategy for revenue matters, land records, and related disputes.",
      image: undefined as string | undefined,
    },
    {
      title: "Contracts & Registration",
      description: "Careful drafting, review, registration, and legal consultation.",
      image: undefined as string | undefined,
    },
    {
      title: "Family & Consumer Matters",
      description: "Thoughtful help with matrimonial disputes, claims, and consumer rights.",
      image: undefined as string | undefined,
    },
    {
      title: "Corporate Compliance",
      description: "Sound counsel for contracts, compliance, arbitration, and businesses.",
      image: undefined as string | undefined,
    },
  ],
  strengths: [
    "Dedicated attorneys",
    "Experienced legal team",
    "Responsive support",
    "Clear, practical counsel",
    "Client-first strategy",
  ],
  team: [
    { name: "Manas Agravat", role: "Advocate", initials: "MA", image: "/images/manas-agravat.jpg" },
    { name: "Rajit Parekh", role: "Associate", initials: "RP", image: "/images/rajit-parekh.jpg" },
    { name: "Jainam Shah", role: "Associate", initials: "JS", image: "/images/jainam-shah.jpg" },
  ],
  testimonials: [
    {
      name: "Madhav Kavaiya",
      quote:
        "A smooth, hassle-free experience with thoughtful guidance throughout the property process.",
    },
    {
      name: "Shivam Joshi",
      quote:
        "Excellent knowledge and clear, actionable advice at every stage of the legal process.",
    },
    {
      name: "Madhav Jajal",
      quote: "Glad to have found a dependable advocate. Great work and responsive support.",
    },
  ],
  nyaycastDescription:
    "Nyaycast is our dedicated space for legal updates, case developments, court judgments, and practical explanations of legal topics.",
  articles: [
    {
      category: "Legal awareness",
      title: "Understanding your rights in a property transaction",
      href: "",
      image: undefined as string | undefined,
    },
    {
      category: "Court update",
      title: "How to read an important court judgment",
      href: "",
      image: undefined as string | undefined,
    },
    {
      category: "Practical guide",
      title: "Before you sign: a contract review checklist",
      href: "",
      image: undefined as string | undefined,
    },
  ],
  disclaimer:
    "The information on this website is for general informational and educational purposes only; it is not legal advice and does not create an advocate-client relationship. For advice on your specific situation, please arrange a consultation.",
};

export type SiteContent = typeof defaultSiteContent;

export async function getSiteContent(): Promise<SiteContent> {
  if (!process.env.DATABASE_URL) return defaultSiteContent;
  try {
    const sql = neon(process.env.DATABASE_URL);
    const [settings, services, strengths, team, testimonials, articles] = await Promise.all([
      sql`SELECT * FROM site_settings WHERE id = 1 LIMIT 1`,
      sql`SELECT title, description, image FROM site_services ORDER BY sort_order, id`,
      sql`SELECT label FROM site_strengths ORDER BY sort_order, id`,
      sql`SELECT name, role, initials, image FROM site_team_members ORDER BY sort_order, id`,
      sql`SELECT name, quote FROM site_testimonials ORDER BY sort_order, id`,
      sql`SELECT category, title, href, image FROM site_articles ORDER BY sort_order, id`,
    ]);

    const row = settings[0];
    if (!row) return defaultSiteContent;

    return {
      firmName: row.firm_name,
      city: row.city,
      heroTitle: row.hero_title,
      heroAccent: row.hero_accent,
      heroDescription: row.hero_description,
      aboutTitle: row.about_title,
      aboutDescription: row.about_description,
      aboutImage: row.about_image || undefined,
      whyImage: row.why_image || undefined,
      address: row.address,
      phone: row.phone,
      email: row.email,
      notificationEmail: row.notification_email,
      officeHours: row.office_hours,
      socials: {
        linkedin: row.linkedin_url || "",
        facebook: row.facebook_url || "",
        instagram: row.instagram_url || "",
        whatsapp: row.whatsapp_url || "",
      },
      services: services.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.image || undefined,
      })),
      strengths: strengths.map((item) => item.label),
      team: team.map((item) => ({
        name: item.name,
        role: item.role,
        initials: item.initials,
        image: item.image || undefined,
      })),
      testimonials: testimonials.map((item) => ({ name: item.name, quote: item.quote })),
      nyaycastDescription: row.nyaycast_description,
      articles: articles.map((item) => ({
        category: item.category,
        title: item.title,
        href: item.href,
        image: item.image || undefined,
      })),
      disclaimer: row.disclaimer,
    } as SiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(value: SiteContent) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const sql = neon(process.env.DATABASE_URL);

  await sql`INSERT INTO site_settings (
    id, firm_name, city, hero_title, hero_accent, hero_description,
    about_title, about_description, about_image, why_image, address,
    phone, email, notification_email, office_hours, linkedin_url,
    facebook_url, instagram_url, whatsapp_url, nyaycast_description, disclaimer, updated_at
  ) VALUES (
    1, ${value.firmName}, ${value.city}, ${value.heroTitle}, ${value.heroAccent}, ${value.heroDescription},
    ${value.aboutTitle}, ${value.aboutDescription}, ${value.aboutImage || null}, ${value.whyImage || null}, ${value.address},
    ${value.phone}, ${value.email}, ${value.notificationEmail}, ${value.officeHours}, ${value.socials.linkedin || null},
    ${value.socials.facebook || null}, ${value.socials.instagram || null}, ${value.socials.whatsapp || null},
    ${value.nyaycastDescription}, ${value.disclaimer}, NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    firm_name = EXCLUDED.firm_name, city = EXCLUDED.city, hero_title = EXCLUDED.hero_title,
    hero_accent = EXCLUDED.hero_accent, hero_description = EXCLUDED.hero_description,
    about_title = EXCLUDED.about_title, about_description = EXCLUDED.about_description,
    about_image = EXCLUDED.about_image, why_image = EXCLUDED.why_image, address = EXCLUDED.address,
    phone = EXCLUDED.phone, email = EXCLUDED.email, notification_email = EXCLUDED.notification_email,
    office_hours = EXCLUDED.office_hours, linkedin_url = EXCLUDED.linkedin_url, facebook_url = EXCLUDED.facebook_url,
    instagram_url = EXCLUDED.instagram_url, whatsapp_url = EXCLUDED.whatsapp_url,
    nyaycast_description = EXCLUDED.nyaycast_description, disclaimer = EXCLUDED.disclaimer, updated_at = NOW()`;

  await sql`DELETE FROM site_services`;
  for (const [sortOrder, item] of value.services.entries()) {
    await sql`INSERT INTO site_services (title, description, image, sort_order) VALUES (${item.title}, ${item.description}, ${item.image || null}, ${sortOrder})`;
  }

  await sql`DELETE FROM site_strengths`;
  for (const [sortOrder, label] of value.strengths.entries()) {
    await sql`INSERT INTO site_strengths (label, sort_order) VALUES (${label}, ${sortOrder})`;
  }

  await sql`DELETE FROM site_team_members`;
  for (const [sortOrder, item] of value.team.entries()) {
    await sql`INSERT INTO site_team_members (name, role, initials, image, sort_order) VALUES (${item.name}, ${item.role}, ${item.initials}, ${item.image || null}, ${sortOrder})`;
  }

  await sql`DELETE FROM site_testimonials`;
  for (const [sortOrder, item] of value.testimonials.entries()) {
    await sql`INSERT INTO site_testimonials (name, quote, sort_order) VALUES (${item.name}, ${item.quote}, ${sortOrder})`;
  }

  await sql`DELETE FROM site_articles`;
  for (const [sortOrder, item] of value.articles.entries()) {
    await sql`INSERT INTO site_articles (category, title, href, image, sort_order) VALUES (${item.category}, ${item.title}, ${item.href}, ${item.image || null}, ${sortOrder})`;
  }
}
