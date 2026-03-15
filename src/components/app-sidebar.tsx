"use client";

import { useState, useEffect } from "react";
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
  Mail,
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
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <SidebarMenuButton
      tooltip="Log Out"
      onClick={handleLogout}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-geist font-medium tracking-wide">Log Out</span>
    </SidebarMenuButton>
  );
}

import { Logo } from "@/components/logo";

import { UseUser } from "../../contexts/UserContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = UseUser();
  const isAdmin = user?.role === "ADMIN";

  const filteredItems = items.filter(item => {
    if (item.title === "Admin Panel") return isAdmin;
    return true;
  });

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 px-2 py-4">
            <Logo size="sm" showText />
          </div>
          <SidebarGroupLabel className="font-geist">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
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
            <SidebarMenuButton
              tooltip="Support"
              asChild
              className="hover:bg-primary/10 transition-colors"
            >
              <a href="mailto:savemyconference@gmail.com">
                <Mail className="w-4 h-4" />
                <span className="font-geist font-medium tracking-wide">Support</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
