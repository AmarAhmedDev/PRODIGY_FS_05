import { createFileRoute } from "@tanstack/react-router";
import { CreatePost } from "@/components/CreatePost";
import { Feed } from "@/components/Feed";

export const Route = createFileRoute("/_authenticated/feed")({
  head: () => ({ meta: [{ title: "Home — Pulse" }] }),
  component: FeedPage,
});

function FeedPage() {
  return (
    <div className="space-y-6">
      <CreatePost />
      <Feed />
    </div>
  );
}