import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const trendingTopics = [
  { category: "Technology · Trending", title: "#ReactJS", posts: "24.5K" },
  { category: "Design · Trending", title: "UI/UX", posts: "12.1K" },
  { category: "Development · Trending", title: "Vite", posts: "8.2K" },
  { category: "Programming · Trending", title: "TypeScript", posts: "45.3K" },
];

const suggestedUsers = [
  { name: "Sarah Drasner", handle: "@sarah_edo", avatar: "S" },
  { name: "Dan Abramov", handle: "@dan_abramov", avatar: "D" },
  { name: "Guillermo Rauch", handle: "@rauchg", avatar: "G" },
];

export function RightSidebar() {
  return (
    <aside className="hidden lg:block sticky top-[4.5rem] h-[calc(100vh-4.5rem)] w-full py-6 pl-6">
      <div className="flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Pulse" 
            className="pl-10 bg-muted/50 border-transparent focus:bg-background rounded-full"
          />
        </div>

        <div className="glass rounded-2xl p-4 border border-white/5 space-y-4">
          <h2 className="font-bold text-xl px-2">What's happening</h2>
          <div className="space-y-4">
            {trendingTopics.map((topic, i) => (
              <div key={i} className="px-2 cursor-pointer group">
                <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{topic.category}</p>
                <p className="font-bold">{topic.title}</p>
                <p className="text-xs text-muted-foreground">{topic.posts} posts</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-4 border border-white/5 space-y-4">
          <h2 className="font-bold text-xl px-2">Who to follow</h2>
          <div className="space-y-4">
            {suggestedUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate hover:underline cursor-pointer">{user.name}</p>
                  <p className="text-muted-foreground text-sm truncate">{user.handle}</p>
                </div>
                <Button variant="secondary" size="sm" className="rounded-full font-bold">
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
