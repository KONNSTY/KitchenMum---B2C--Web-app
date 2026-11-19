"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BookOpen,
  ChefHat,
  CircleUserRound,
  CreditCard,
  Heart,
  Home,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Utensils,
  Bell,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/contexts/auth-context";

const mainLinks = [
  { href: "/app", label: "Übersicht", icon: Home },
  { href: "/app/recipes", label: "Meine Rezepte", icon: BookOpen },
  { href: "/app/import", label: "Rezept hinzufügen", icon: Plus },
  { href: "/app/favorites", label: "Favoriten", icon: Heart },
];
const accountLinks = [
  { href: "/app/plan", label: "Abo & Vorteile", icon: CreditCard },
  { href: "/app/account", label: "Einstellungen", icon: Settings },
];

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const links = mobile
    ? [mainLinks[0], mainLinks[1], mainLinks[2], mainLinks[3]]
    : [...mainLinks, ...accountLinks];
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/app"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
        return mobile ? (
          <Link key={href} href={href} className={active ? "active" : ""}>
            <Icon size={18} strokeWidth={1.8} />
            <span>
              {label === "Übersicht"
                ? "Start"
                : label === "Rezept hinzufügen"
                  ? "Import"
                  : label === "Meine Rezepte"
                    ? "Rezepte"
                    : "Merkliste"}
            </span>
          </Link>
        ) : (
          <Link
            key={href}
            href={href}
            className={`side-link ${active ? "active" : ""}`}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function AppShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) router.replace("/login");
  }, [loading, user, router]);
  const crumb = pathname.includes("/recipes/")
    ? "Rezept"
    : pathname.includes("import")
      ? "Rezept hinzufügen"
      : pathname.includes("favorites")
        ? "Favoriten"
        : pathname.includes("plan")
          ? "Abo & Vorteile"
          : pathname.includes("account")
            ? "Einstellungen"
            : pathname.includes("recipes")
              ? "Meine Rezepte"
              : "Deine Küche";
  if (loading || !user || !user.emailVerified) {
    return <main className="auth-page"><p role="status">Dein Konto wird geladen …</p></main>;
  }
  const displayName = user.displayName || user.email?.split("@")[0] || "Konto";
  const initials = displayName.slice(0, 1).toUpperCase();
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href="/app" className="brand">
          <span className="brand-mark">
            <ChefHat size={21} />
          </span>
          <span>KitchenMum</span>
        </Link>
        <div className="side-label">Deine Küche</div>
        <nav className="side-nav">
          <NavLinks />
        </nav>
        <div className="side-bottom">
          <div className="side-label">Dein Konto</div>
          <nav className="side-nav">
            {accountLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`side-link ${pathname.startsWith(href) ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="upgrade-card">
            <strong>
              <Sparkles size={15} /> Mehr Genuss, mehr Platz
            </strong>
            <p>
              Speichere unbegrenzt viele Rezepte und nutze alle KI-Funktionen.
            </p>
            <Link className="btn-primary btn-full" href="/app/plan">
              Premium entdecken
            </Link>
          </div>
          <div className="sidebar-user">
            <span className="avatar">{initials}</span>
            <span>
              <strong>{displayName}</strong>
              <small>Free Mitglied</small>
            </span>
            <button
              className="icon-button ms-auto"
              aria-label="Abmelden"
              onClick={() => void signOut(auth).then(() => router.push("/"))}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <main className="app-main">
        <header className="topbar">
          <div className="mobile-header">
            <Link href="/app" className="brand">
              <span className="brand-mark">
                <ChefHat size={18} />
              </span>
              <span>KitchenMum</span>
            </Link>
          </div>
          <div className="breadcrumb">
            Meine Küche <span aria-hidden="true">/</span>{" "}
            <strong>{crumb}</strong>
          </div>
          <div className="top-actions">
            <Link
              href="/app/recipes"
              className="icon-button"
              aria-label="Rezepte suchen"
            >
              <Search size={17} />
            </Link>
            <button
              className="icon-button"
              aria-label="Benachrichtigungen"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("kitchenmum-toast", {
                    detail: "Du bist auf dem neuesten Stand.",
                  }),
                )
              }
            >
              <Bell size={17} />
            </button>
            <Link
              href="/app/account"
              className="avatar"
              aria-label="Zum Profil"
            >
              {initials}
            </Link>
          </div>
        </header>
        {children}
      </main>
      <nav className="mobile-nav">
        <NavLinks mobile />
      </nav>
    </div>
  );
}
