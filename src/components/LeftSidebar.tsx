import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Home, Compass, Bell, Mail, User, Bookmark, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePost } from "@/components/CreatePost";

const navItems = [
  { icon: Home, label: "Home", href: "/feed" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Mail, label: "Messages", href: "/messages" },
  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function LeftSidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="hidden md:block sticky top-[4.5rem] h-[calc(100vh-4.5rem)] w-full py-6 pr-6">
      <div className="flex flex-col gap-6 h-full">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-4 px-4 py-3 text-lg font-medium rounded-full hover:bg-white/5 transition-colors group"
              activeProps={{ className: "bg-white/5 text-primary" }}
            >
              <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="group-hover:text-primary transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              className="w-full rounded-full py-6 text-lg font-bold shadow-glow"
              size="lg"
            >
              Post
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-[600px]">
            <DialogTitle className="sr-only">Create a new post</DialogTitle>
            <CreatePost onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>

        <div className="mt-auto pt-6">
          <Link
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary/80 to-primary flex items-center justify-center shrink-0">
              <span className="font-semibold text-primary-foreground uppercase text-sm">
                {user?.email?.charAt(0) || user?.displayName?.charAt(0) || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
}

