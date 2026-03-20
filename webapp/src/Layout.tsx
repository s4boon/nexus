import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sun } from "lucide-react";
import { Button } from "./components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="w-full bg-background">
        <nav className="flex justify-end w-full px-2 py-1 bg-accent text-accent-foreground">
          <Button variant="secondary" size="icon" className="rounded">
            <Sun />
          </Button>
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
