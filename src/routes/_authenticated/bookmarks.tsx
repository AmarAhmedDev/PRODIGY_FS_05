import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { PostCard, type Post } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  head: () => ({ meta: [{ title: "Bookmarks — Pulse" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);

  // Show posts the user has liked as "bookmarks"
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "posts"),
      where("likes", "array-contains", user.uid),
      orderBy("createdAt", "desc"),
      limit(50),
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Bookmarks</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Posts you've liked are saved here for quick access
        </p>
      </div>

      {!posts ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border/60 bg-card/60 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center">
          <Bookmark className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">No bookmarks yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Like a post and it'll show up here.
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
  );
}
