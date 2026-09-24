"use client";

import Link from "next/link";
import { useState } from "react";
import { UI_MESSAGES } from "@/constants/messages";

type MobileNavItem = {
  href: string;
  label: string;
};

type MobileNavProps = {
  items: readonly MobileNavItem[];
  ctaHref: string;
  activeHref?: string;
};

export function MobileNav({ items, ctaHref, activeHref }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? UI_MESSAGES.closeMenu : UI_MESSAGES.openMenu}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#17253d]/15 text-[#17253d] transition hover:border-[#b8955d] hover:text-[#b8955d]"
      >
        <span className="sr-only">{open ? UI_MESSAGES.closeMenuShort : UI_MESSAGES.openMenuShort}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
          <span className={`block h-px w-full bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-px w-full bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-full bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </span>
      </button>

      {open && (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-b border-[#17253d]/10 bg-[#f8f6f0] px-4 pb-5 pt-3 shadow-lg sm:px-8">
          <nav className="mx-auto flex max-w-6xl flex-col text-sm font-semibold uppercase tracking-wider text-slate-700" aria-label="Mobile navigation">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`border-b border-[#17253d]/10 py-3.5 transition hover:text-[#b8955d] ${activeHref === item.href ? "text-[#b8955d]" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={closeMenu}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#17253d] px-4 py-3 text-xs font-semibold tracking-wider text-[#f8f6f0] shadow-sm transition hover:bg-[#20314f]"
            >
              {UI_MESSAGES.bookConsultation}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
