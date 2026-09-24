"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { UI_MESSAGES } from "@/constants/messages";
import { getApiError } from "@/lib/common";

type Service = { title: string; description: string; image?: string };
type TeamMember = { name: string; role: string; initials: string; image?: string };
type Testimonial = { name: string; quote: string };
type Article = { category: string; title: string; href: string; image?: string };
type Consultation = {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
};

interface SiteContent {
  firmName: string;
  city: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  whyImage?: string;
  address: string;
  phone: string;
  email: string;
  notificationEmail: string;
  officeHours: string;
  socials: {
    linkedin: string;
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
  services: Service[];
  strengths: string[];
  team: TeamMember[];
  testimonials: Testimonial[];
  nyaycastDescription: string;
  articles: Article[];
  disclaimer: string;
}

const TABS = [
  { key: "general", label: "General & Hero", icon: "🏠" },
  { key: "about", label: "About Section", icon: "📖" },
  { key: "services", label: "Services", icon: "⚖️" },
  { key: "team", label: "Team Members", icon: "👥" },
  { key: "testimonials", label: "Testimonials", icon: "💬" },
  { key: "nyaycast", label: "Nyaycast & News", icon: "📰" },
  { key: "contact", label: "Contact & Footer", icon: "📍" },
  { key: "consultations", label: "Consultation Inbox", icon: "📬" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ─── Image Upload Component ─── */
function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 space-y-3">
        {value ? (
          <div className="relative group aspect-video max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-inner">
            <Image src={value} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg transition"
                onClick={() => onChange("")}
              >
                Remove photo ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs">
            No image selected
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            className="flex-1 min-w-[200px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL (e.g. /images/photo.jpg or https://...)"
          />
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium px-4 py-2 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>📁 Choose File</>
            )}
          </button>
          {value && (
            <button
              type="button"
              className="text-slate-400 hover:text-red-500 text-xs p-2 rounded-lg transition"
              onClick={() => onChange("")}
              title="Clear photo"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

/* ─── Reusable Field Components ─── */
function TextField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {multiline ? (
        <textarea
          className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white focus:dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition leading-relaxed"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
        />
      ) : (
        <input
          type="text"
          className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white focus:dark:bg-slate-950 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/* ─── Toast Component ─── */
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium transition-all ${
        type === "success"
          ? "bg-slate-900 text-amber-400 border-slate-800"
          : "bg-red-950 text-red-200 border-red-800"
      }`}
    >
      <span className="text-lg">{type === "success" ? "✓" : "⚠️"}</span>
      <span>{message}</span>
      <button
        type="button"
        className="ml-2 text-slate-400 hover:text-white transition"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}

/* ─── Main Admin Dashboard Component ─── */
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<TabKey>("general");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const r = await fetch("/api/site");
      const data = await r.json();
      setContent(data);
    } catch {
      setToast({ message: UI_MESSAGES.loadContentFailed, type: "error" });
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchContent();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchContent]);

  const fetchConsultations = useCallback(async () => {
    setLoadingConsultations(true);
    try {
      const r = await fetch("/api/admin/consultations");
      if (r.ok) setConsultations(await r.json());
    } catch {
      /* ignore */
    } finally {
      setLoadingConsultations(false);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn || tab !== "consultations") return;

    const timer = window.setTimeout(() => {
      void fetchConsultations();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loggedIn, tab, fetchConsultations]);

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      const message = await getApiError(r, UI_MESSAGES.incorrectPassword);
      setLoginError(message || UI_MESSAGES.incorrectPassword);
    }
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    try {
      const r = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (r.ok) {
        setToast({ message: UI_MESSAGES.publishSuccess, type: "success" });
        setDirty(false);
      } else {
        setToast({ message: await getApiError(r, UI_MESSAGES.unableToSaveChanges), type: "error" });
      }
    } catch {
      setToast({ message: UI_MESSAGES.adminNetworkError, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setLoggedIn(false);
    setPassword("");
  }

  /* ─── Login Screen ─── */
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 shadow-2xl rounded-3xl p-8 backdrop-blur-xl space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xs font-medium text-slate-400 hover:text-amber-400 transition inline-flex items-center gap-1"
            >
              ← Back to website
            </Link>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border border-slate-800 px-2 py-0.5 rounded-full">
              CMS v2.0
            </span>
          </div>

          <div className="text-center space-y-2 pt-2">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-950 font-serif font-bold text-xl rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-900/30">
              MA
            </div>
            <h1 className="text-2xl font-serif font-medium tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to edit pages, manage services, and view client consultations.
            </p>
          </div>

          <form onSubmit={login} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Security Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm rounded-xl py-3 shadow-lg shadow-amber-950/50 transition-all transform active:scale-[0.98] cursor-pointer"
            >
              Sign In to Dashboard →
            </button>
          </form>

          {loginError && (
            <div className="bg-red-950/60 border border-red-900/80 rounded-xl p-3 text-xs text-red-300 text-center">
              {loginError}
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading website content…</p>
      </main>
    );
  }

  /* ─── Tab Content Renderers ─── */
  function renderGeneral() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-serif text-slate-900 dark:text-white">General & Hero Section</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Update your firm&apos;s identity, hero banner copy, and legal notice disclaimer.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField
              label="Firm Name"
              value={content!.firmName}
              onChange={(v) => update("firmName", v)}
            />
            <TextField
              label="City / Location"
              value={content!.city}
              onChange={(v) => update("city", v)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField
              label="Hero Title"
              value={content!.heroTitle}
              onChange={(v) => update("heroTitle", v)}
              placeholder="e.g. Good counsel"
            />
            <TextField
              label="Hero Accent Headline"
              value={content!.heroAccent}
              onChange={(v) => update("heroAccent", v)}
              placeholder="e.g. changes everything."
            />
          </div>
          <TextField
            label="Hero Subtitle / Description"
            value={content!.heroDescription}
            onChange={(v) => update("heroDescription", v)}
            multiline
          />
          <TextField
            label="Legal Disclaimer Notice"
            value={content!.disclaimer}
            onChange={(v) => update("disclaimer", v)}
            multiline
          />
        </div>
      </div>
    );
  }

  function renderAbout() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-serif text-slate-900 dark:text-white">About Section</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your firm&apos;s biography, photos, and key strengths list.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <TextField
            label="About Heading"
            value={content!.aboutTitle}
            onChange={(v) => update("aboutTitle", v)}
          />
          <TextField
            label="About Description"
            value={content!.aboutDescription}
            onChange={(v) => update("aboutDescription", v)}
            multiline
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <ImageUpload
              label="About Section Portrait Photo"
              value={content!.aboutImage || ""}
              onChange={(url) => update("aboutImage", url)}
            />
            <ImageUpload
              label="Why Choose Us Banner Photo"
              value={content!.whyImage || ""}
              onChange={(url) => update("whyImage", url)}
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Firm Strengths ({content!.strengths.length})
              </h3>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-medium px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                onClick={() => update("strengths", [...content!.strengths, "New legal strength"])}
              >
                + Add Strength
              </button>
            </div>

            <div className="space-y-2.5">
              {content!.strengths.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl"
                >
                  <span className="text-slate-400 font-mono text-xs w-6 text-center">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    value={s}
                    onChange={(e) => {
                      const arr = [...content!.strengths];
                      arr[i] = e.target.value;
                      update("strengths", arr);
                    }}
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => {
                        const arr = [...content!.strengths];
                        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                        update("strengths", arr);
                      }}
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      disabled={i === content!.strengths.length - 1}
                      onClick={() => {
                        const arr = [...content!.strengths];
                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        update("strengths", arr);
                      }}
                      title="Move Down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="p-1 text-red-400 hover:text-red-600 transition"
                      onClick={() =>
                        update(
                          "strengths",
                          content!.strengths.filter((_, j) => j !== i),
                        )
                      }
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderServices() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white">Services & Practice Areas</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Add, edit, re-order, or delete practice areas shown on your homepage and services page.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition cursor-pointer"
            onClick={() =>
              update("services", [
                ...content!.services,
                { title: "New Practice Area", description: "Description of services offered." },
              ])
            }
          >
            + Add Practice Area
          </button>
        </div>

        <div className="space-y-4">
          {content!.services.map((svc, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Practice Area #{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => {
                      const arr = [...content!.services];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      update("services", arr);
                    }}
                  >
                    ↑ Move up
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === content!.services.length - 1}
                    onClick={() => {
                      const arr = [...content!.services];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      update("services", arr);
                    }}
                  >
                    ↓ Move down
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg transition"
                    onClick={() =>
                      update(
                        "services",
                        content!.services.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>

              <TextField
                label="Service Title"
                value={svc.title}
                onChange={(v) => {
                  const arr = [...content!.services];
                  arr[i] = { ...arr[i], title: v };
                  update("services", arr);
                }}
              />
              <TextField
                label="Description"
                value={svc.description}
                onChange={(v) => {
                  const arr = [...content!.services];
                  arr[i] = { ...arr[i], description: v };
                  update("services", arr);
                }}
                multiline
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderTeam() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white">Team Members</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage profiles, upload photos, and set display order for advocates & associate staff.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition cursor-pointer"
            onClick={() =>
              update("team", [
                ...content!.team,
                { name: "New Associate", role: "Associate Advocate", initials: "NA" },
              ])
            }
          >
            + Add Team Member
          </button>
        </div>

        <div className="space-y-6">
          {content!.team.map((member, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 overflow-hidden relative flex items-center justify-center font-bold text-amber-500 text-xs">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    ) : (
                      <span>{member.initials || "MA"}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{member.name || "Unnamed"}</h3>
                    <p className="text-xs text-slate-400">{member.role || "No role specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => {
                      const arr = [...content!.team];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      update("team", arr);
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === content!.team.length - 1}
                    onClick={() => {
                      const arr = [...content!.team];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      update("team", arr);
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg transition"
                    onClick={() =>
                      update(
                        "team",
                        content!.team.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  value={member.name}
                  onChange={(v) => {
                    const arr = [...content!.team];
                    arr[i] = { ...arr[i], name: v };
                    update("team", arr);
                  }}
                />
                <TextField
                  label="Role / Title"
                  value={member.role}
                  onChange={(v) => {
                    const arr = [...content!.team];
                    arr[i] = { ...arr[i], role: v };
                    update("team", arr);
                  }}
                />
              </div>
              <TextField
                label="Initials (fallback avatar label)"
                value={member.initials}
                onChange={(v) => {
                  const arr = [...content!.team];
                  arr[i] = { ...arr[i], initials: v };
                  update("team", arr);
                }}
              />
              <ImageUpload
                label="Profile Photo"
                value={member.image || ""}
                onChange={(url) => {
                  const arr = [...content!.team];
                  arr[i] = { ...arr[i], image: url };
                  update("team", arr);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderTestimonials() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white">Client Testimonials</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage client quotes and reviews featured on your website.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition cursor-pointer"
            onClick={() =>
              update("testimonials", [
                ...content!.testimonials,
                { name: "Client Name", quote: "Client testimonial statement." },
              ])
            }
          >
            + Add Testimonial
          </button>
        </div>

        <div className="space-y-4">
          {content!.testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="text-amber-500 font-serif font-bold text-lg">“ Quote #{i + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => {
                      const arr = [...content!.testimonials];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      update("testimonials", arr);
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === content!.testimonials.length - 1}
                    onClick={() => {
                      const arr = [...content!.testimonials];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      update("testimonials", arr);
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg transition"
                    onClick={() =>
                      update(
                        "testimonials",
                        content!.testimonials.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              <TextField
                label="Client / Organization Name"
                value={t.name}
                onChange={(v) => {
                  const arr = [...content!.testimonials];
                  arr[i] = { ...arr[i], name: v };
                  update("testimonials", arr);
                }}
              />
              <TextField
                label="Testimonial Quote"
                value={t.quote}
                onChange={(v) => {
                  const arr = [...content!.testimonials];
                  arr[i] = { ...arr[i], quote: v };
                  update("testimonials", arr);
                }}
                multiline
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderNyaycast() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white">Nyaycast / Legal Updates</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Publish legal awareness articles, court updates, and knowledge posts.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition cursor-pointer"
            onClick={() =>
              update("articles", [
                ...content!.articles,
                { category: "Legal Awareness", title: "New Legal Update Article", href: "" },
              ])
            }
          >
            + Add Article
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <TextField
            label="Nyaycast Section Overview Text"
            value={content!.nyaycastDescription}
            onChange={(v) => update("nyaycastDescription", v)}
            multiline
          />
        </div>

        <div className="space-y-4">
          {content!.articles.map((a, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <span className="font-mono text-xs font-bold text-slate-400">
                  Article #{i + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => {
                      const arr = [...content!.articles];
                      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                      update("articles", arr);
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-30"
                    disabled={i === content!.articles.length - 1}
                    onClick={() => {
                      const arr = [...content!.articles];
                      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                      update("articles", arr);
                    }}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg transition"
                    onClick={() =>
                      update(
                        "articles",
                        content!.articles.filter((_, j) => j !== i),
                      )
                    }
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Category Label"
                  value={a.category}
                  onChange={(v) => {
                    const arr = [...content!.articles];
                    arr[i] = { ...arr[i], category: v };
                    update("articles", arr);
                  }}
                />
                <TextField
                  label="External Link URL (Optional)"
                  value={a.href}
                  onChange={(v) => {
                    const arr = [...content!.articles];
                    arr[i] = { ...arr[i], href: v };
                    update("articles", arr);
                  }}
                  placeholder="https://..."
                />
              </div>

              <TextField
                label="Article Title"
                value={a.title}
                onChange={(v) => {
                  const arr = [...content!.articles];
                  arr[i] = { ...arr[i], title: v };
                  update("articles", arr);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderContact() {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-serif text-slate-900 dark:text-white">Contact Info & Office Hours</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Update phone numbers, office location address, and consultation operating hours.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <TextField
            label="Office Location Address"
            value={content!.address}
            onChange={(v) => update("address", v)}
            multiline
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField
              label="Primary Phone Number"
              value={content!.phone}
              onChange={(v) => update("phone", v)}
            />
            <TextField
              label="Contact Email Address"
              value={content!.email}
              onChange={(v) => update("email", v)}
            />
          </div>
          <TextField
            label="Consultation Alert Recipient Email"
            value={content!.notificationEmail || "manas0812@yopmail.com"}
            onChange={(v) => update("notificationEmail", v)}
            placeholder="manas0812@yopmail.com"
          />
          <TextField
            label="Office Working Hours"
            value={content!.officeHours}
            onChange={(v) => update("officeHours", v)}
            placeholder="e.g. Monday to Saturday · 10:00 am to 8:00 pm"
          />

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Social Media & Messaging Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="WhatsApp Direct Link"
                value={content!.socials?.whatsapp || ""}
                onChange={(v) => update("socials", { ...content!.socials, whatsapp: v })}
                placeholder="https://wa.me/919978844826"
              />
              <TextField
                label="LinkedIn Profile URL"
                value={content!.socials?.linkedin || ""}
                onChange={(v) => update("socials", { ...content!.socials, linkedin: v })}
                placeholder="https://www.linkedin.com/in/..."
              />
              <TextField
                label="Facebook Page URL"
                value={content!.socials?.facebook || ""}
                onChange={(v) => update("socials", { ...content!.socials, facebook: v })}
                placeholder="https://www.facebook.com/..."
              />
              <TextField
                label="Instagram Profile URL"
                value={content!.socials?.instagram || ""}
                onChange={(v) => update("socials", { ...content!.socials, instagram: v })}
                placeholder="https://www.instagram.com/..."
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderConsultations() {
    const filtered = consultations.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white">Consultation Inbox</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Client messages submitted through your website booking form.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium px-3.5 py-2 rounded-xl transition cursor-pointer"
              onClick={fetchConsultations}
              disabled={loadingConsultations}
            >
              {loadingConsultations ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>
        </div>

        {consultations.length === 0 && !loadingConsultations && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-2">
            <div className="text-4xl">📬</div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No consultation requests yet
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Submissions from the website consultation form will appear here in real time.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3 hover:border-amber-500/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm border border-amber-500/20">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {new Date(c.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition"
                  >
                    📞 {c.phone}
                  </a>
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      ✉️ {c.email}
                    </a>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl leading-relaxed border border-slate-100 dark:border-slate-800/60 font-sans">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tabContent: Record<TabKey, () => React.ReactNode> = {
    general: renderGeneral,
    about: renderAbout,
    services: renderServices,
    team: renderTeam,
    testimonials: renderTestimonials,
    nyaycast: renderNyaycast,
    contact: renderContact,
    consultations: renderConsultations,
  };

  /* ─── Dashboard Layout ─── */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-900 border-r border-slate-800 flex-col flex-shrink-0 justify-between">
        <div className="p-6 space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-amber-600 text-slate-950 font-serif font-bold text-lg rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
              MA
            </div>
            <div>
              <span className="block text-sm font-bold text-white tracking-wide">Studio CMS</span>
              <span className="block text-[10px] text-slate-400">Content & Consultations</span>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{t.icon}</span>
                    {t.label}
                  </span>
                  {t.key === "consultations" && consultations.length > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {consultations.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2.5 transition"
          >
            <span>View Live Site</span>
            <span>↗</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full text-left text-xs text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 text-slate-100">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            <h1 className="text-lg font-serif font-medium text-white flex items-center gap-2">
              <span>{TABS.find((t) => t.key === tab)?.icon}</span>
              <span>{TABS.find((t) => t.key === tab)?.label}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {dirty && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Unsaved Changes
              </span>
            )}
            {tab !== "consultations" && (
              <button
                type="button"
                className={`inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-xs rounded-xl px-5 py-2.5 shadow-lg shadow-amber-950/40 transition-all cursor-pointer ${
                  dirty ? "ring-2 ring-amber-400/50" : ""
                }`}
                onClick={save}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>Publish Changes</>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => {
                  setTab(t.key);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                  tab === t.key ? "bg-amber-500/20 text-amber-400" : "text-slate-300"
                }`}
              >
                <span>
                  {t.icon} {t.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Content Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-950">{tabContent[tab]()}</main>
      </div>
    </div>
  );
}
