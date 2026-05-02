import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, username: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

async function ensureProfile(user: User, usernameOverride?: string) {
  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      username:
        usernameOverride ||
        user.displayName ||
        user.email?.split("@")[0] ||
        "user",
      displayName: user.displayName || usernameOverride || "",
      photoURL: user.photoURL || null,
      bio: "",
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) ensureProfile(u).catch(console.error);
    });
    return unsub;
  }, []);

  const value: AuthCtx = {
    user,
    loading,
    async signInEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signUpEmail(email, password, username) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (username) await updateProfile(cred.user, { displayName: username });
      await ensureProfile(cred.user, username);
    },
    async signInGoogle() {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureProfile(cred.user);
    },
    async logout() {
      await signOut(auth);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}