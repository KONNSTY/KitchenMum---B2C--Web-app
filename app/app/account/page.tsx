"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Download, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/contexts/auth-context";
import { apiRequest } from "@/lib/api";
import { useRecipes } from "@/lib/contexts/recipe-context";
import { deleteAccountDocument, getAccountDocument, updateAccountName } from "@/lib/firestore-account";

type Profile = { userId: string; name: string; email: string; createdAt: string; updatedAt: string };
type Subscription = { plan: string; status: string; currentPeriodStart: string | null; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean };

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { recipes } = useRecipes();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiRequest<Profile>(user, "v1/profile"),
      getAccountDocument(user),
    ]).then(([profileData, subscriptionData]) => {
      setProfile(profileData);
      const plan = subscriptionData?.subscription as { plan?: string; status?: string } | undefined;
      setSubscription({ plan: plan?.plan || "free", status: plan?.status || "free", currentPeriodStart: null, currentPeriodEnd: null, cancelAtPeriodEnd: false });
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Kontodaten konnten nicht geladen werden."));
  }, [user]);
  const saveProfile = async () => {
    if (!user || !profile) return;
    setBusy(true); setError("");
    try {
      const name = profile.name.trim();
      await updateProfile(user, { displayName: name });
      const saved = await apiRequest<Profile>(user, "v1/profile", { method: "PUT", body: JSON.stringify({ display_name: name }) });
      await updateAccountName(user, name);
      setProfile(saved); setNotice("Dein Profil wurde gespeichert.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Speichern fehlgeschlagen."); }
    finally { setBusy(false); }
  };
  const exportData = async () => {
    if (!user || !profile) return;
    setBusy(true); setError("");
    try {
      const [currentRecipes, preferences, currentSubscription] = await Promise.all([
        apiRequest<import("@/lib/types").Recipe[]>(user, "v1/recipes"),
        apiRequest<Record<string, unknown>>(user, "v1/preferences"),
        apiRequest<Subscription>(user, "v1/subscription"),
      ]);
      const data = { profile, exportedAt: new Date().toISOString(), recipes: currentRecipes, preferences, subscription: currentSubscription };
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "kitchenmum-export.json"; anchor.click(); URL.revokeObjectURL(url);
      setNotice("Dein Datenexport wurde heruntergeladen.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Export fehlgeschlagen."); }
    finally { setBusy(false); }
  };
  const deleteData = async () => {
    if (!user || !window.confirm("Alle KitchenMum-Profildaten, Rezepte, Einstellungen und Abo-Metadaten dauerhaft löschen? Dein Firebase-Anmeldekonto bleibt bestehen.")) return;
    setBusy(true); setError("");
    try {
      await apiRequest<void>(user, "v1/account", { method: "DELETE" });
      await deleteAccountDocument(user);
      setProfile(null); setSubscription(null);
      await signOut(auth);
      router.push("/");
      setNotice("Deine KitchenMum-Daten wurden gelöscht. Das Anmeldekonto bleibt bestehen.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Löschen fehlgeschlagen."); }
    finally { setBusy(false); }
  };
  const logout = async () => { await signOut(auth); router.push("/"); };
  return (
    <div className="page-content">
      <div className="page-heading"><div><span className="eyebrow">Deine Daten & Einstellungen</span><h1>Mein Konto</h1><p>Verwalte dein Profil und deine KitchenMum Sammlung.</p></div></div>
      <div className="account-layout">
        <section className="panel">
          <div className="account-section-title"><span className="stat-icon"><UserRound size={18} /></span><div><h2>Persönliche Angaben</h2><p>Diese Angaben sind mit deinem Firebase-Konto verknüpft.</p></div></div>
          <div className="field"><label htmlFor="profile-name">Name</label><input id="profile-name" value={profile?.name ?? user?.displayName ?? ""} onChange={(e) => setProfile((current) => current ? { ...current, name: e.target.value } : null)} maxLength={120} /></div>
          <div className="field"><label htmlFor="profile-email">E-Mail-Adresse</label><input id="profile-email" type="email" value={user?.email ?? ""} readOnly /></div>
          <button className="btn-primary" onClick={() => void saveProfile()} disabled={busy || !profile}><Check size={16} /> Änderungen speichern</button>
          <hr className="divider" />
          <div className="account-row"><div><strong>Mitgliedschaft</strong><p>KitchenMum {subscription?.plan ?? "Free"} · {subscription?.status ?? "wird geladen"}</p></div><Link className="btn-secondary" href="/app/plan">Abo ansehen</Link></div>
        </section>
        <aside className="account-aside">
          <section className="panel"><ShieldCheck size={23} className="account-shield" /><h3>Deine Sammlung gehört dir.</h3><p>Profil, Rezepte, Einstellungen und Abo-Metadaten werden deinem angemeldeten Konto zugeordnet gespeichert.</p><button className="btn-secondary btn-full" onClick={() => void exportData()} disabled={busy || !profile}><Download size={16} /> Meine Daten exportieren</button></section>
          <section className="panel account-delete-panel"><h3>KitchenMum-Daten löschen</h3><p>Entfernt dein Profil, deine Rezepte, Einstellungen und Abo-Metadaten aus der Datenbank. Dein Firebase-Anmeldekonto bleibt erhalten.</p><button className="btn-danger-soft btn-full" onClick={() => void deleteData()} disabled={busy}>Meine App-Daten löschen</button></section>
          <button className="btn-secondary btn-full logout-button" onClick={() => void logout()}><LogOut size={16} /> Abmelden</button>
        </aside>
      </div>
      {(notice || error) && <div className={error ? "form-error" : "notice-bar"} role={error ? "alert" : "status"}><span>{error || notice}</span><button className="btn-quiet" onClick={() => { setNotice(""); setError(""); }}>Schließen</button></div>}
    </div>
  );
}
