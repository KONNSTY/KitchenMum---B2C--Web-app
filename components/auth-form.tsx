"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChefHat, Mail, Sparkles } from "lucide-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth, firebaseConfigured } from "@/lib/firebase";
import { apiRequest } from "@/lib/api";
import { ensureAccountDocument } from "@/lib/firestore-account";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!firebaseConfigured) throw new Error("Firebase ist noch nicht vollständig konfiguriert.");
      if (signup) {
        const cleanName = name.trim();
        if (!termsAccepted) throw new Error("Bitte akzeptiere zuerst die Nutzungsbedingungen.");
        if (cleanName.length < 2 || cleanName.length > 120) throw new Error("Der Name muss zwischen 2 und 120 Zeichen lang sein.");
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: cleanName });
        await ensureAccountDocument(credential.user, cleanName);
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setMessage("Dein Konto ist angelegt. Bitte bestätige deine E-Mail über den Link, den wir dir geschickt haben, und melde dich danach an.");
      } else {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user);
          await signOut(auth);
          setMessage("Bitte bestätige zuerst deine E-Mail. Wir haben dir einen neuen Bestätigungslink geschickt.");
          return;
        }
        await ensureAccountDocument(credential.user);
        await apiRequest(credential.user, "v1/profile", {
          method: "PUT",
          body: JSON.stringify({ display_name: credential.user.displayName || name || email.split("@")[0] }),
        });
        router.push("/app");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Das hat nicht geklappt. Bitte versuche es erneut.",
      );
    } finally {
      setLoading(false);
    }
  };
  const signInWithGoogle = async () => {
    setError(""); setMessage(""); setLoading(true);
    try {
      if (!firebaseConfigured) throw new Error("Firebase ist noch nicht vollständig konfiguriert.");
      if (signup && !termsAccepted) throw new Error("Bitte akzeptiere zuerst die Nutzungsbedingungen.");
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      await ensureAccountDocument(credential.user);
      await apiRequest(credential.user, "v1/profile", {
        method: "PUT",
        body: JSON.stringify({ display_name: credential.user.displayName || credential.user.email?.split("@")[0] || "Mitglied" }),
      });
      router.push("/app");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Google-Anmeldung fehlgeschlagen.");
    } finally { setLoading(false); }
  };
  return (
    <main className="auth-page">
      <div className="auth-art">
        <Image
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1500&q=90"
          alt="Warme Küche mit hausgemachtem Essen"
          fill
          priority
          sizes="50vw"
        />
        <div className="auth-quote">
          <span>
            <Sparkles size={15} /> Für deine Lieblingsrezepte
          </span>
          <h2>Die guten Rezepte verdienen einen festen Platz.</h2>
          <p>Speichere, sortiere und mach sie zu deinen eigenen.</p>
        </div>
      </div>
      <div className="auth-card-wrap">
        <section className="auth-card">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <ChefHat size={20} />
            </span>
            <span>KitchenMum</span>
          </Link>
          <h1>
            {signup
              ? "Willkommen in deiner Küche."
              : "Schön, dass du wieder da bist."}
          </h1>
          <p>
            {signup
              ? "Erstelle dein kostenloses Konto und sammle deine ersten Rezepte."
              : "Melde dich an und mach da weiter, wo du aufgehört hast."}
          </p>
          <button
            className="social-button"
            type="button"
            onClick={() => void signInWithGoogle()}
            disabled={loading}
          >
            <span className="google-mark">G</span> Mit Google{" "}
            {signup ? "registrieren" : "anmelden"}
          </button>
          <div className="auth-divider">
            <span>oder mit E-Mail</span>
          </div>
          <form onSubmit={submit}>
            {signup && (
              <div className="field">
                <label htmlFor="auth-name">Dein Name</label>
                <input
                  id="auth-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Wie dürfen wir dich nennen?"
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="auth-email">E-Mail-Adresse</label>
              <span className="input-icon">
                <Mail size={16} />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="du@beispiel.de"
                  required
                />
              </span>
            </div>
            <div className="field">
              <label htmlFor="auth-password">Passwort</label>
              <input
                id="auth-password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                minLength={signup ? 8 : 6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  signup ? "Mindestens 8 Zeichen" : "Mindestens 6 Zeichen"
                }
                required
              />
            </div>
            {!signup && (
              <button
                type="button"
                className="forgot-link"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setMessage("");
                  if (!email.trim()) {
                    setError("Gib zuerst deine E-Mail-Adresse ein.");
                    setLoading(false);
                    return;
                  }
                  if (!firebaseConfigured) {
                    setError("Firebase ist noch nicht vollständig konfiguriert.");
                    setLoading(false);
                    return;
                  }
                  void sendPasswordResetEmail(auth, email.trim())
                    .then(() => setMessage("Wenn ein Konto zu dieser Adresse existiert, erhältst du eine E-Mail zum Zurücksetzen des Passworts."))
                    .catch(() => setError("Die E-Mail konnte gerade nicht versendet werden. Bitte prüfe die Adresse und versuche es erneut."))
                    .finally(() => setLoading(false));
                }}
              >
                Passwort vergessen?
              </button>
            )}
            {signup && (
              <div className="auth-terms">
                <input
                  id="auth-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  required
                />
                <div>
                  <label htmlFor="auth-terms">
                    Ich akzeptiere die Nutzungsbedingungen.
                  </label>
                  <p>
                    <Link href="/agb">AGB</Link> ·{" "}
                    <Link href="/datenschutz">Datenschutzhinweise</Link>. Es wird kein kostenpflichtiges Abo geschlossen.
                  </p>
                </div>
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="form-message" role="status">
                {message}
              </p>
            )}
            <button
              className="btn-primary btn-full auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Einen Moment …"
                : signup
                  ? "Kostenloses Konto erstellen"
                  : "Anmelden"}
            </button>
          </form>
          <p className="auth-switch">
            {signup ? "Du hast schon ein Konto?" : "Noch kein Konto?"}{" "}
            <Link href={signup ? "/login" : "/signup"}>
              {signup ? "Jetzt anmelden" : "Kostenlos registrieren"}
            </Link>
          </p>
          <p className="auth-legal">
            {signup
              ? "Dein Konto wird mit Firebase Auth geschützt. Deine Rezepte und Profildaten werden in deiner KitchenMum-Datenbank gespeichert."
              : "Melde dich mit deinem Firebase-Konto an. Deine Daten bleiben deinem Konto zugeordnet."}
          </p>
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Zurück zur Startseite
          </Link>
        </section>
      </div>
    </main>
  );
}
