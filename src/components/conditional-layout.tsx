"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/footer";
import { GlobalConferenceSwitcher } from "@/components/conference-switcher";

import { useLayoutSettings } from "@/hooks/use-layout-settings";

// Routes that should NOT show the sidebar (full-screen pages)
const SIDEBAR_FREE_PREFIXES = ["/login", "/pricing", "/checkout", "/verify"];

import { Logo } from "@/components/logo";
import { useState } from "react";
import axios from "axios";
import { UseConference } from "../../contexts/ConferenceContext";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { layoutMode } = useLayoutSettings();
  const { conferences, setConferences } = UseConference();

  const isSidebarFree =
    pathname === "/" ||
    SIDEBAR_FREE_PREFIXES.some((route) => pathname.startsWith(route));

  if (isSidebarFree) {
    return (
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div data-layout-mode={layoutMode} className="contents">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sticky top-0 bg-background z-20">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <div className="mr-2 h-4 w-px bg-border" />
                <Logo size="sm" showText />
              </div>
              <GlobalConferenceSwitcher />
            </header>
            <div
              className={`flex flex-1 flex-col transition-all duration-300 ${
                layoutMode === "mobile-optimized"
                  ? "gap-2 p-3 md:gap-4 md:p-4"
                  : "gap-4 p-4 md:gap-8 md:p-8"
              }`}
            >
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
