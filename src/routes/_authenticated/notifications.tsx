import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Pulse" }] }),
  component: NotificationsPage,
});

interface Notification {
  id: string;
  type: "like" | "comment";
  postId: string;
  postText: string;
  fromUsername: string;
  fromPhotoURL: string | null;
  createdAt: Timestamp | null;
}

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "now";
  const diff = (Date.now() - ts.toMillis()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Build notifications from posts the user authored that have likes/comments from others
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
      setLoading(false);
    });
    return unsub;
  }, [user]);

  // Derive notifications: likes on your posts
  const notifications: { type: string; count: number; postId: string; postText: string; createdAt: Timestamp | null }[] = [];

  posts.forEach((post) => {
    const otherLikes = (post.likes || []).filter((uid: string) => uid !== user?.uid);
    if (otherLikes.length > 0) {
      notifications.push({
        type: "like",
        count: otherLikes.length,
        postId: post.id,
        postText: post.text?.slice(0, 80) || "(media post)",
        createdAt: post.createdAt,
      });
    }
    if ((post.commentCount || 0) > 0) {
      notifications.push({
        type: "comment",
        count: post.commentCount,
        postId: post.id,
        postText: post.text?.slice(0, 80) || "(media post)",
        createdAt: post.createdAt,
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Bell className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card/60 p-4 animate-pulse h-16" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">No notifications yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            When people like or comment on your posts, you'll see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <Link
              key={`${n.postId}-${n.type}-${i}`}
              to="/feed"
              className="block"
            >
              <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 hover:bg-card/90 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${n.type === "like" ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"}`}>
                    {n.type === "like" ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {n.count} {n.count === 1 ? "person" : "people"}
                      </span>{" "}
                      {n.type === "like" ? "liked" : "commented on"} your post
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      "{n.postText}"
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
