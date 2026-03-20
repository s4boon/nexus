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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Clock,
  Compass,
  Dices,
  Home,
  LibraryBig,
} from "lucide-react";

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar className="text-sidebar-accent" collapsible="icon">
      <SidebarHeader className="flex w-full items-end">
        <SidebarTrigger
          variant={"outline"}
          size={"icon"}
          className="hover:text-white text-purple-400 hover:shadow-2xl shadow-purple-600"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu className="text-accent-foreground">
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <Home /> Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <LibraryBig /> Browse
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <Compass /> Discover
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <Dices /> Random
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <Clock /> Latest Episodes
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded cursor-pointer">
                <Calendar /> Schedule
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
