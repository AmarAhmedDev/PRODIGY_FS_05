import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Shield, Palette, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Pulse" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const saveDisplayName = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      await updateDoc(doc(db, "profiles", user.uid), {
        displayName: displayName.trim(),
        username: displayName.trim(),
      });
      toast.success("Display name updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Settings className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Account section */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Account</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
              Email
            </label>
            <Input
              value={user?.email || ""}
              disabled
              className="bg-muted/30 text-muted-foreground"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
              Display Name
            </label>
            <div className="flex gap-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
              />
              <Button
                onClick={saveDisplayName}
                disabled={saving || !displayName.trim()}
                className="bg-gradient-primary text-primary-foreground shrink-0"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
              User ID
            </label>
            <Input
              value={user?.uid || ""}
              disabled
              className="bg-muted/30 text-muted-foreground font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Appearance section */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Appearance</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Pulse currently uses a dark theme by default. Light mode and custom themes are coming soon.
        </p>
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-primary border-2 border-primary shadow-glow" title="Current theme" />
          <div className="h-10 w-10 rounded-full bg-muted border-2 border-border opacity-40 cursor-not-allowed" title="Light mode (coming soon)" />
        </div>
      </div>

      {/* Privacy section */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Privacy & Security</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Your account is secured with Firebase Authentication. Two-factor authentication and privacy controls are coming in a future update.
        </p>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-card/70 backdrop-blur p-6 shadow-card space-y-4">
        <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="rounded-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out of Pulse
        </Button>
      </div>
    </div>
  );
}
