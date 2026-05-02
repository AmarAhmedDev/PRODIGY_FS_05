import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, MessageCircle, Heart, ArrowRight, Globe2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse — A modern social network" },
      {
        name: "description",
        content:
          "Share moments, spark conversations and follow the pulse of your world. A premium, real-time social network.",
      },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative h-8 w-8 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
        <span className="text-primary-foreground font-bold">P</span>
      </div>
      <span className="text-lg font-semibold tracking-tight">Pulse</span>
    </Link>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="py-20 md:py-32 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3 py-1 text-xs text-muted-foreground mb-6 animate-slide-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Real-time. Beautifully crafted.
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] animate-slide-up">
            Share what moves you.
            <br />
            <span className="text-gradient">Feel the Pulse.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            A modern social network for thoughts, photos and moments — with a premium, immersive feel.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 animate-slide-up">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                Create your account <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign in</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 pb-24">
          {[
            { icon: Zap, title: "Real-time feed", desc: "New posts and reactions stream in instantly." },
            { icon: Heart, title: "Meaningful reactions", desc: "Like and comment with one tap. No noise." },
            { icon: Globe2, title: "Global, fast, secure", desc: "Built on Firebase with images served by ImageKit." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 shadow-card hover:shadow-elevated transition-smooth hover:-translate-y-0.5"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-primary/20 border border-primary/30 flex items-center justify-center text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>

        <section className="pb-24">
          <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur p-8 md:p-12 shadow-elevated text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold">Join the conversation</h2>
            <p className="mt-2 text-muted-foreground">
              Sign up in seconds with email or Google.
            </p>
            <div className="mt-6">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  Get started — free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pulse. Crafted with care.
      </footer>
    </div>
  );
}
