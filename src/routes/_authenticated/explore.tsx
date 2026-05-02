import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PostCard, type Post } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Flame } from "lucide-react";

export const Route = createFileRoute("/_authenticated/explore")({
  head: () => ({ meta: [{ title: "Explore — Pulse" }] }),
  component: ExplorePage,
});

function ExplorePage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(100),
    );
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return unsub;
  }, []);

  const filtered = posts?.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.text?.toLowerCase().includes(term) ||
      p.author?.username?.toLowerCase().includes(term)
    );
  });

  // Sort by most likes for "trending"
  const trending = posts
    ? [...posts].sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0)).slice(0, 20)
    : null;

  const displayPosts = searchTerm.trim() ? filtered : trending;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Flame className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Explore</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Discover trending posts and find new content
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts and users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-muted/50 border-border/60 rounded-full"
        />
      </div>

      {searchTerm.trim() && (
        <p className="text-sm text-muted-foreground">
          {filtered?.length ?? 0} results for "{searchTerm}"
        </p>
      )}

      {!searchTerm.trim() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-medium">Trending — most liked posts</span>
        </div>
      )}

      {!displayPosts ? (
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
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayPosts.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-10 text-center">
          <h3 className="text-lg font-semibold">No posts found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term." : "Nothing trending yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
