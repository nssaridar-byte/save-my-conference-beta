"use client";

import {
  FileText,
  Home,
  MessageSquare,
  Newspaper,
  Settings,
  BrainCircuit,
  Swords,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Speech Lab",
    url: "/speech-lab",
    icon: MessageSquare,
  },
  {
    title: "Quiz Arena",
    url: "/quiz-arena",
    icon: BrainCircuit,
  },
  {
    title: "Crisis Simulator",
    url: "/crisis-simulator",
    icon: Newspaper,
  },
  {
    title: "Debate Arena",
    url: "/debate-arena",
    icon: Swords,
  },
  {
    title: "Dual Library",
    url: "/library",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Admin Panel",
    url: "/admin",
    icon: ShieldAlert,
  },
];

function LogoutButton() {
  const router = useRouter();
  return (
    <SidebarMenuButton
      tooltip="Log Out"
      onClick={() => router.push("/login")}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-geist font-medium tracking-wide">Log Out</span>
    </SidebarMenuButton>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-playfair font-bold text-lg">M</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-playfair font-semibold text-sm leading-tight text-foreground tracking-wide">
                COMMAND
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Center
              </span>
            </div>
          </div>
          <SidebarGroupLabel className="font-geist">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={`rounded-full transition-all duration-300 ease-in-out ${isActive ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' : 'hover:bg-primary/10'}`}
                    >
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span className="font-geist font-medium tracking-wide">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
