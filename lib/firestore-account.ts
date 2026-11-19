import { deleteDoc, doc, getDoc, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

export async function ensureAccountDocument(user: User, displayName?: string) {
  const reference = doc(db, "accounts", user.uid);
  const name = (displayName || user.displayName || user.email?.split("@")[0] || "Mitglied").trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error("Der Name muss zwischen 2 und 120 Zeichen lang sein.");
  }
  if (!user.email) throw new Error("Für dieses Konto ist keine E-Mail-Adresse verfügbar.");

  // A transaction prevents concurrent sign-in callbacks from overwriting an
  // existing profile or subscription with the initial free-account defaults.
  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(reference);
    if (existing.exists()) return;
    transaction.set(reference, {
      displayName: name,
      email: user.email,
      settings: {},
      subscription: { plan: "free", status: "free" },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  return reference;
}

export async function getAccountDocument(user: User) {
  const reference = await ensureAccountDocument(user);
  return (await getDoc(reference)).data();
}

export async function updateAccountName(user: User, displayName: string) {
  const reference = await ensureAccountDocument(user);
  await updateDoc(reference, { displayName, updatedAt: serverTimestamp() });
}

export async function deleteAccountDocument(user: User) {
  await deleteDoc(doc(db, "accounts", user.uid));
}
