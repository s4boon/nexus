import NexusLogo from "@/assets/nexus-logo.svg?react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/lib/ThemeProvider";
import { cn } from "@/lib/utils";
import { routes } from "@/Routes";
import { ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router";

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();
  const { resolvedTheme } = useTheme();
  return (
    <Sidebar
      className={`${resolvedTheme} text-sidebar-accent bg-sidebar`}
      collapsible="icon"
    >
      <SidebarHeader className="flex w-full items-end">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={`flex ${open ? "justify-center" : "justify-start"} group/header transition-all
 "text-accent-foreground border border-transparent rounded active:bg-purple-400/10 font-sans`}
            >
              <a
                href={"https://anime.nexus"}
                className="text-accent-foreground hover:text-purple-500 active:text-purple-500 "
                target="_blank"
                rel="noopener noreferrer"
              >
                <NexusLogo className="w-8 h-8" />
                <span className="flex gap-x-1 items-center group-hover/header:underline underline-offset-2 group-hover/header:text-purple-500">
                  Nexus{" "}
                  <ExternalLink
                    className="invisible group-hover/header:visible"
                    size={4}
                  />
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {routes.map((route, i) => {
              const isActive = location.pathname === route.path;
              if (route.sidebar_group !== "Main") return;
              return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-accent-foreground hover:text-purple-500 active:text-purple-500 border border-transparent rounded active:bg-purple-400/10",
                      isActive
                        ? " text-purple-400 border-purple-400 bg-purple-400/10"
                        : "",
                    )}
                  >
                    <Link to={route.path}>
                      {route.sidebar_icon} {route.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
