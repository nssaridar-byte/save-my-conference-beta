"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizes = {
  sm: { box: "w-12 h-12", logo: 40 },
  md: { box: "w-16 h-16", logo: 52 },
  lg: { box: "w-28 h-28", logo: 84 },
  xl: { box: "w-40 h-40", logo: 120 },
};

export function Logo({ className = "", size = "md", showText = false }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`${sizes[size].box} rounded-xl bg-muted animate-pulse ${className}`} />;
  }

  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative ${sizes[size].box} flex items-center justify-center rounded-full overflow-hidden bg-transparent`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={logoSrc}
              alt="Save My Conference Logo"
              width={sizes[size].logo}
              height={sizes[size].logo}
              className={`object-contain transition-all duration-300 rounded-full [clip-path:circle(50%)] ${
                resolvedTheme === "dark" ? "mix-blend-screen brightness-110" : "mix-blend-multiply"
              }`}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-playfair font-bold text-foreground leading-tight tracking-wide">
            SAVE MY CONFERENCE
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium leading-none">
            MUN Command Center
          </span>
        </div>
      )}
    </div>
  );
}
