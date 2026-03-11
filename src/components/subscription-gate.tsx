"use client";

import { useUsageStore, type UsageType, FREE_DAILY_LIMITS } from "@/hooks/use-usage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { useState } from "react";

const USAGE_LABELS: Record<UsageType, string> = {
  speeches: "speech analyses",
  quizzes: "quiz sessions",
  crisis: "crisis simulations",
  debates: "debate simulations",
};

export function withSubscriptionGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  actionType: UsageType
) {
  return function WithSubscriptionGate(props: P) {
    const { isLimitReached, getRemainingToday } = useUsageStore();
    const [isGateOpen, setIsGateOpen] = useState(false);

    const limitHit = isLimitReached(actionType);
    const remaining = getRemainingToday(actionType);
    const limit = FREE_DAILY_LIMITS[actionType];

    const handleClickWrapper = (e: React.MouseEvent) => {
      if (limitHit) {
        e.preventDefault();
        e.stopPropagation();
        setIsGateOpen(true);
      }
    };

    return (
      <>
        <div onClickCapture={handleClickWrapper} className="w-fit relative">
          <WrappedComponent {...props} />
          {!limitHit && remaining <= 1 && remaining > 0 && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
            </span>
          )}
        </div>

        <Dialog open={isGateOpen} onOpenChange={setIsGateOpen}>
          <DialogContent className="sm:max-w-md border-primary/20 bg-card rounded-3xl overflow-hidden p-0">
            {/* Header band */}
            <div className="bg-primary/10 border-b border-primary/20 p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-playfair text-2xl font-bold tracking-tight text-foreground">
                  Security Clearance Required
                </DialogTitle>
                <DialogDescription className="text-base mt-2 font-geist leading-relaxed">
                  You've used all <strong className="text-foreground">{limit} {USAGE_LABELS[actionType]}</strong> available today on the Free tier.
                  Upgrade to unlock unlimited access.
                </DialogDescription>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-5">
              {/* Plan card */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-primary" />
                    <h4 className="font-geist font-bold text-primary">Senior Diplomat (Pro)</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Unlimited everything · $8/month · 3-day free trial</p>
                </div>
                <span className="text-2xl font-playfair font-black text-primary">$8</span>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  type="button"
                  className="w-full rounded-full py-5 bg-primary hover:bg-primary/90 text-primary-foreground font-geist font-semibold tracking-wide"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsGateOpen(false)}
                  className="w-full rounded-full text-muted-foreground hover:text-foreground"
                >
                  Continue on Free Tier
                </Button>
                <p className="text-xs text-center text-muted-foreground">Resets midnight tonight · No card required for trial</p>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
}
