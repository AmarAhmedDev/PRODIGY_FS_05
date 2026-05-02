import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  increment,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Trash2, Send, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface Post {
  id: string;
  uid: string;
  author: { username: string; photoURL: string | null };
  text: string;
  media: { url: string; type: string } | null;
  likes: string[];
  commentCount: number;
  createdAt: Timestamp | null;
}

interface Comment {
  id: string;
  uid: string;
  username: string;
  text: string;
  parentId?: string | null;
  createdAt: Timestamp | null;
}

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "now";
  const diff = (Date.now() - ts.toMillis()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const isOwner = !!user && user.uid === post.uid;
  const liked = !!user && post.likes?.includes(user.uid);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!showComments) return;
    const q = query(
      collection(db, "posts", post.id, "comments"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
  }, [showComments, post.id]);

  const toggleLike = async () => {
    if (!user) return;
    if (isOwner) {
      toast.error("You can't like your own post");
      return;
    }
    const ref = doc(db, "posts", post.id);
    try {
      await updateDoc(ref, {
        likes: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch {
      toast.error("Could not update like");
    }
  };

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;
    if (isOwner) {
      toast.error("You can't comment on your own post — reply to others instead");
      return;
    }
    const text = newComment.trim().slice(0, 300);
    setNewComment("");
    try {
      await addDoc(collection(db, "posts", post.id, "comments"), {
        uid: user.uid,
        username: user.displayName || user.email?.split("@")[0] || "user",
        text,
        parentId: null,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "posts", post.id), { commentCount: increment(1) });
    } catch {
      toast.error("Could not post comment");
    }
  };

  const submitReply = async (parent: Comment) => {
    if (!user || !replyText.trim()) return;
    if (parent.uid === user.uid) {
      toast.error("You can't reply to your own comment");
      return;
    }
    const text = replyText.trim().slice(0, 300);
    setReplyText("");
    setReplyTo(null);
    try {
      await addDoc(collection(db, "posts", post.id, "comments"), {
        uid: user.uid,
        username: user.displayName || user.email?.split("@")[0] || "user",
        text,
        parentId: parent.id,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "posts", post.id), { commentCount: increment(1) });
    } catch {
      toast.error("Could not post reply");
    }
  };

  const remove = async () => {
    if (!user || user.uid !== post.uid) return;
    if (!confirm("Delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("Post deleted");
    } catch {
      toast.error("Could not delete");
    }
  };

  const initials = post.author?.username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <article className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            {post.author?.photoURL && <AvatarImage src={post.author.photoURL} />}
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{post.author?.username}</div>
            <div className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        {user?.uid === post.uid && (
          <Button
            variant="ghost"
            size="icon"
            onClick={remove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </header>

      {post.text && (
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{post.text}</p>
      )}
      {post.media && (
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          {post.media.type?.startsWith("video") ? (
            <video src={post.media.url} controls className="w-full max-h-[480px]" />
          ) : (
            <img
              src={post.media.url}
              alt=""
              loading="lazy"
              className="w-full max-h-[480px] object-cover"
            />
          )}
        </div>
      )}

      <footer className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          disabled={isOwner}
          title={isOwner ? "You can't like your own post" : undefined}
          className={liked ? "text-destructive hover:text-destructive" : ""}
        >
          <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-current" : ""}`} />
          {post.likes?.length ?? 0}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowComments((s) => !s)}
        >
          <MessageCircle className="h-4 w-4 mr-1.5" />
          {post.commentCount ?? 0}
        </Button>
      </footer>

      {showComments && (
        <div className="mt-4 border-t border-border/60 pt-4 space-y-3 animate-fade-in">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet — say hi 👋</p>
          )}
          {comments
            .filter((c) => !c.parentId)
            .map((c) => {
              const replies = comments.filter((r) => r.parentId === c.id);
              const canReply = isOwner && c.uid !== user?.uid;
              return (
                <div key={c.id} className="text-sm">
                  <div>
                    <span className="font-semibold mr-2">{c.username}</span>
                    <span className="text-foreground/90">{c.text}</span>
                  </div>
                  {replies.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1 border-l border-border/60 pl-3">
                      {replies.map((r) => (
                        <div key={r.id}>
                          <span className="font-semibold mr-2">{r.username}</span>
                          <span className="text-foreground/90">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {canReply && (
                    <div className="mt-2 ml-4">
                      {replyTo?.id === c.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={replyText}
                            autoFocus
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${c.username}…`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                submitReply(c);
                              }
                            }}
                            maxLength={300}
                          />
                          <Button
                            size="icon"
                            onClick={() => submitReply(c)}
                            className="bg-gradient-primary text-primary-foreground"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyTo(c);
                            setReplyText("");
                          }}
                          className="h-7 px-2 text-xs text-muted-foreground"
                        >
                          <Reply className="h-3 w-3 mr-1" /> Reply
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          {!isOwner && (
            <div className="flex items-center gap-2 pt-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment…"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitComment();
                  }
                }}
                maxLength={300}
              />
              <Button
                size="icon"
                onClick={submitComment}
                className="bg-gradient-primary text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}