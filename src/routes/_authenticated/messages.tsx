import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({ meta: [{ title: "Messages — Pulse" }] }),
  component: MessagesPage,
});

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: `Hey ${user?.displayName || "there"}! 👋 Welcome to Pulse Messages. Direct messaging with other users is coming soon. For now, feel free to leave a note here!`,
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simple auto-reply
    setTimeout(() => {
      const replies = [
        "Thanks for your message! DMs between users are coming soon 🚀",
        "Got it! Stay tuned for group chats and direct messaging.",
        "We're building something great. Check back soon for full messaging! 💬",
        "Your feedback matters! We'll have real-time messaging very soon.",
      ];
      const botReply: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: replies[Math.floor(Math.random() * replies.length)],
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Mail className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur shadow-card flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-border/60 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="bg-muted/50 border-border/60 rounded-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              type="button"
              onClick={sendMessage}
              size="icon"
              className="bg-gradient-primary text-primary-foreground rounded-full shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
