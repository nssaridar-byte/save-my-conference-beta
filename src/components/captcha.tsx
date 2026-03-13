"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const startVerification = () => {
    if (status !== "idle") return;
    
    setStatus("verifying");
    setProgress(0);
    
    // Simulate a "smart" verification process
    const duration = 2000;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          setStatus("success");
          onVerify(true);
        }, 300);
      } else {
        setProgress(currentProgress);
      }
    }, interval);
  };

  return (
    <div className="w-full select-none">
      <div 
        onClick={startVerification}
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group ${
          status === "success" 
            ? "border-emerald-500/30 bg-emerald-500/5 cursor-default" 
            : status === "verifying"
            ? "border-primary/30 bg-primary/5 cursor-wait"
            : "border-border bg-card hover:border-primary/50 cursor-pointer"
        }`}
      >
        <div className="p-4 flex items-center gap-4">
          {/* Status Icon */}
          <div className="relative flex-shrink-0">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                >
                  <Shield className="w-5 h-5" />
                </motion.div>
              )}
              {status === "verifying" && (
                <motion.div
                  key="verifying"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </motion.div>
              )}
              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                >
                  <ShieldCheck className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <p className={`text-sm font-medium transition-colors ${
              status === "success" ? "text-emerald-500" : "text-foreground"
            }`}>
              {status === "idle" && "Verify you are human"}
              {status === "verifying" && "Verifying your connection..."}
              {status === "success" && "Verification successful"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
              Secure MUN Verification
            </p>
          </div>

          {/* Cloudflare-style Logo/Mark */}
          <div className="flex flex-col items-end opacity-40 group-hover:opacity-60 transition-opacity">
            <div className="flex items-center gap-1.5 grayscale">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-[8px] font-bold mt-1 text-primary">SHIELD</span>
          </div>
        </div>

        {/* Progress Bar (Visible during verifying) */}
        {status === "verifying" && (
            <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left"
            />
        )}
      </div>
      
      {status === "idle" && (
        <p className="mt-2 text-[10px] text-center text-muted-foreground/60 italic">
          Tip: Click the box to begin verification
        </p>
      )}
    </div>
  );
}
