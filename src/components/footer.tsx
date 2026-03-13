"use client";

import { ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-background py-8 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Minimal Legal & Copyright Row */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2 text-foreground/90">
            <ShieldCheck className="w-3.5 h-3.5 text-primary/70" />
            <p className="text-xs font-bold tracking-tight uppercase text-primary/80">
              Intellectual Property Protection
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground/60 italic font-geist">
            All proprietary algorithms, speech analysis models, and codebase architecture within this command center are the exclusive intellectual property of Save My Conference. Unauthorized reproduction, extraction, or reverse-engineering is strictly prohibited and protected under international copyright law.
          </p>
        </div>

        <div className="flex flex-col lg:items-end gap-1 shrink-0 opacity-80">
          <p className="text-xs font-semibold text-foreground/70">
            © {currentYear} Save My Conference
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            All rights reserved worldwide.
          </p>
          <a 
            href="mailto:savemyconference@gmail.com" 
            className="text-[10px] text-primary hover:underline font-medium mt-1"
          >
            Contact Support: savemyconference@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
}
