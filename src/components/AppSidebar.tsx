import { Home, SquareKanban, Type, Wrench } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SignOutBtn from "./SignOutBtn";

export function AppSidebar() {
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: SquareKanban,
    },
    {
      title: "Tools",
      url: "/tools",
      icon: Wrench,
    },
    {
      title: "Content Blocks",
      url: "/content-blocks",
      icon: Type,
    },
  ];

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutBtn />
      </SidebarFooter>
    </Sidebar>
  );
}
