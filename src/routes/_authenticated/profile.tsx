import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { PostCard, type Post } from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Pencil, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Pulse" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  // Load profile
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "profiles", user.uid);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
        setEditName(snap.data().displayName || snap.data().username || "");
        setEditBio(snap.data().bio || "");
      }
    });
  }, [user]);

  // Load user's posts
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "posts"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: editName });
      await updateDoc(doc(db, "profiles", user.uid), {
        displayName: editName,
        username: editName,
        bio: editBio,
      });
      setProfile((prev: any) => ({
        ...prev,
        displayName: editName,
        username: editName,
        bio: editBio,
      }));
      toast.success("Profile updated!");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const totalLikes = posts?.reduce((sum, p) => sum + (p.likes?.length ?? 0), 0) ?? 0;
  const initials = (
    profile?.username || user?.displayName || user?.email || "U"
  )
    .slice(0, 2)
    .toUpperCase();

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-6 shadow-card">
        <div className="flex items-start gap-5">
          <Avatar className="h-20 w-20 border-2 border-primary/30">
            {user?.photoURL && <AvatarImage src={user.photoURL} />}
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold truncate">
                  {profile?.displayName || profile?.username || user?.displayName || "User"}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                    Edit profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Display Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">
                        Bio
                      </label>
                      <Textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={3}
                        maxLength={160}
                        placeholder="Tell the world about yourself..."
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {editBio.length}/160
                      </p>
                    </div>
                    <Button
                      onClick={saveProfile}
                      disabled={saving}
                      className="w-full bg-gradient-primary text-primary-foreground"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {profile?.bio && (
              <p className="mt-3 text-sm leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-5 mt-4 text-sm text-muted-foreground">
              {joinDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {joinDate}
                </span>
              )}
              <span>
                <strong className="text-foreground">{posts?.length ?? 0}</strong> posts
              </span>
              <span>
                <strong className="text-foreground">{totalLikes}</strong> likes received
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's posts */}
      <div>
        <h2 className="text-lg font-bold mb-4">Your Posts</h2>
        {!posts ? (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/60 p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center">
            <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">No posts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your first thought with the world!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
