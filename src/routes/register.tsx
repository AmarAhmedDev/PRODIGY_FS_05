import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Pulse" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-base">
          ← Back home
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}