"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing for a better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/70 dark:bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-xl font-bold text-foreground">
                    Cookie Preferences
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-2 font-geist">
                    We use cookies to enhance your experience, analyze site traffic, and tailor your MUN preparation tools.
                  </p>
                </div>
                <button 
                  onClick={handleDecline}
                  className="p-2 -mr-2 hover:bg-muted/50 rounded-full transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAccept}
                  className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className="flex-1 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 font-medium h-12 transition-all active:scale-[0.98]"
                >
                  Essential Only
                </Button>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-geist">
                <ShieldCheck className="w-3 h-3" />
                Privacy Secured
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
