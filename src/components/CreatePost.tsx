import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToImageKit } from "@/lib/imagekit-upload";
import { ImagePlus, Loader2, X, Send } from "lucide-react";
import { toast } from "sonner";

export function CreatePost({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async () => {
    if (!user) return;
    if (!text.trim() && !file) {
      toast.error("Write something or add a photo");
      return;
    }
    setBusy(true);
    try {
      let media: { url: string; type: string } | null = null;
      if (file) {
        const up = await uploadToImageKit(file);
        media = { url: up.url, type: up.fileType };
      }
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        author: {
          username: user.displayName || user.email?.split("@")[0] || "user",
          photoURL: user.photoURL || null,
        },
        text: text.trim(),
        media,
        likes: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
      });
      setText("");
      onPick(null);
      if (fileRef.current) fileRef.current.value = "";
      toast.success("Posted");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to post");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 shadow-card">
      <Textarea
        id="create-post-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        maxLength={500}
        className="resize-none border-0 bg-transparent focus-visible:ring-0 text-base"
      />
      {preview && (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-border">
          <img src={preview} alt="preview" className="max-h-80 w-full object-cover" />
          <button
            type="button"
            onClick={() => onPick(null)}
            className="absolute top-2 right-2 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="text-primary hover:text-primary"
        >
          <ImagePlus className="h-4 w-4 mr-1.5" /> Add media
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{text.length}/500</span>
          <Button
            type="button"
            disabled={busy}
            onClick={submit}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-1.5" /> Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}