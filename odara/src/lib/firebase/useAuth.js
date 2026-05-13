// lib/firebase/useAuth.js
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  reload,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// ── Friendly error messages ──────────────────────────────────────────────────
function friendlyError(code) {
  const map = {
    "auth/email-already-in-use":
      "An account with this email already exists.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/weak-password":
      "Password must be at least 6 characters.",
    "auth/user-not-found":
      "No account found with this email.",
    "auth/wrong-password":
      "Incorrect password. Please try again.",
    "auth/invalid-credential":
      "Incorrect email or password. Please try again.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user":
      "Sign-in popup was closed. Please try again.",
    "auth/cancelled-popup-request":
      "Sign-in was cancelled. Please try again.",
    "auth/network-request-failed":
      "Network error. Check your connection.",
    "auth/account-exists-with-different-credential":
      "An account already exists with a different sign-in method.",
    "auth/user-disabled":
      "This account has been disabled. Contact support.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

// ── Strip undefined — Firestore rejects undefined values ────────────────────
function clean(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key] = value;
  }
  return result;
}

// ── Save user profile to Firestore ──────────────────────────────────────────
async function saveUserToFirestore(user, extraData = {}) {
  if (!user?.uid) {
    console.error("saveUserToFirestore: no uid on user object", user);
    return;
  }

  const payload = clean({
    uid:      user.uid,
    email:    user.email        ?? "",
    fullName: user.displayName  ?? extraData.fullName ?? "",
    phone:    extraData.phone   ?? "",
    dob:      extraData.dob     ?? "",
    photoURL: user.photoURL     ?? "",
  });

  await setDoc(
    doc(db, "users", user.uid),
    { ...payload, createdAt: serverTimestamp() },
    { merge: true }
  );
}

// ── useUser — reactive current-user state ───────────────────────────────────
export function useUser() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}

// ── useAuth — action-oriented hook ──────────────────────────────────────────
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signup = async ({ fullName, email, password, phone, dob }) => {
    setLoading(true);
    setError("");
    try {
      // 1. Create auth user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Set display name
      await updateProfile(user, { displayName: fullName ?? "" });

      // 3. Reload so displayName is populated
      await reload(user);
      const refreshedUser = auth.currentUser;

      // 4. Send verification email
      await sendEmailVerification(refreshedUser);

      // 5. Save to Firestore
      await saveUserToFirestore(refreshedUser, {
        fullName: fullName ?? "",
        phone:    phone    ?? "",
        dob:      dob      ?? "",
      });

      return refreshedUser;
    } catch (err) {
      console.error("signup error:", err.code, err.message);
      setError(friendlyError(err.code));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Verification Email ──────────────────────────────────────────────
  const sendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      await sendEmailVerification(user);
      return true;
    } catch (err) {
      console.error("sendVerificationEmail error:", err.code, err.message);
      setError(friendlyError(err.code));
      return false;
    }
  };

  // ── Reload User & Check Verification ──────────────────────────────────────
  // Forces Firebase to re-fetch the user object from the server,
  // then returns true if emailVerified is now set.
  const reloadUser = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return false;
      await reload(user);                    // hits Firebase servers
      return auth.currentUser.emailVerified; // true once link is clicked
    } catch (err) {
      console.error("reloadUser error:", err.code, err.message);
      return false;
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (err) {
      console.error("login error:", err.code, err.message);
      setError(friendlyError(err.code));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
  const resetPassword = async (email) => {
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error("resetPassword error:", err.code, err.message);
      setError(friendlyError(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign In ─────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const { user } = await signInWithPopup(auth, provider);
      await saveUserToFirestore(user);
      return user;
    } catch (err) {
      console.error("Google login error:", err.code, err.message);
      setError(friendlyError(err.code));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Facebook Sign In ───────────────────────────────────────────────────────
  const loginWithFacebook = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new FacebookAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await saveUserToFirestore(user);
      return user;
    } catch (err) {
      console.error("Facebook login error:", err.code, err.message);
      setError(friendlyError(err.code));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Out ───────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    setError("");
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      console.error("logout error:", err.code, err.message);
      setError(friendlyError(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    login,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    sendVerificationEmail,
    reloadUser,
    loading,
    error,
    setError,
  };
}