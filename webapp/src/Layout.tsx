import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ThemeToggle from "./components/ThemeToggle";
import { cn } from "./lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();
  return (
    <>
      <AppSidebar />
      <main className="w-full bg-background">
        <nav className="flex justify-between items-center w-full px-2 py-1 bg-accent text-accent-foreground">
          <SidebarTrigger
            className={cn(
              "rounded border hover:border-purple-500 hover:text-purple-500",
              open
                ? "bg-purple-500/5 text-purple-400 border-purple-400 hover:bg-accent"
                : "bg-accent text-accent-foreground border-transparent",
            )}
          />
          <ThemeToggle />
        </nav>
        {children}
      </main>
    </>
  );
}
