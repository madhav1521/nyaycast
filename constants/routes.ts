export const ROUTES = {
  home: "/",
  homeSection: {
    home: "#home",
    about: "#about",
    services: "#services",
    consultation: "#consultation",
  },
  about: "/about",
  services: "/services",
  team: "/team",
  nyaycast: "/nyaycast",
  contact: "/contact",
  admin: "/admin",
} as const;

export const SITE_NAVIGATION = [
  { href: ROUTES.homeSection.about, label: "About" },
  { href: ROUTES.services, label: "Services" },
  { href: ROUTES.team, label: "Team" },
  { href: ROUTES.nyaycast, label: "Nyaycast" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

export type SiteRoute = keyof typeof ROUTES;
export type SiteNavigationItem = (typeof SITE_NAVIGATION)[number];
