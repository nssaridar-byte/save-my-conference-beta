"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// Routes that should NOT show the sidebar (full-screen pages)
const SIDEBAR_FREE_PREFIXES = ["/login", "/pricing"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSidebarFree =
    pathname === "/" ||
    SIDEBAR_FREE_PREFIXES.some((route) => pathname.startsWith(route));

  if (isSidebarFree) {
    return <TooltipProvider>{children}</TooltipProvider>;
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="mr-2 h-4 w-px bg-border" />
            <h1 className="font-playfair font-semibold text-lg">Save My Conference</h1>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
