"use client";

import { useUsageStore, type UsageState } from "@/hooks/use-usage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useState } from "react";

const FREE_LIMITS = {
  speeches: 2,
  quizzes: 3,
  crisis: 2,
  debates: 1,
};

export function withSubscriptionGate<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  actionType: keyof typeof FREE_LIMITS
) {
  return function WithSubscriptionGate(props: P) {
    const usage = useUsageStore();
    const [isGateOpen, setIsGateOpen] = useState(false);

    const role = "FREE";
    const usageCount = Number(usage[`${actionType}Count` as keyof UsageState]) || 0;
    const limitHit = usageCount >= FREE_LIMITS[actionType];

    const handleClickWrapper = (e: React.MouseEvent) => {
      if (role === "FREE" && limitHit) {
        e.preventDefault();
        e.stopPropagation();
        setIsGateOpen(true);
      }
    };

    return (
      <>
        <div onClickCapture={handleClickWrapper} className="w-fit">
          <WrappedComponent {...props} />
        </div>

        <Dialog open={isGateOpen} onOpenChange={setIsGateOpen}>
          <DialogContent className="sm:max-w-md border-primary/20 bg-card">
            <DialogHeader>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle className="text-center font-playfair text-2xl tracking-tight text-foreground">
                Security Clearance Required
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2 font-geist">
                You have reached your Free Tier limit for {actionType}. 
                Upgrade your status to access unlimited resources.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                  <div>
                      <h4 className="font-geist font-bold text-primary">Senior Diplomat (Pro)</h4>
                      <p className="text-xs text-muted-foreground">$8/mo • Billed Monthly</p>
                  </div>
              </div>
            </div>
            <DialogFooter className="sm:justify-center flex-col gap-2">
              <Button type="button" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-geist uppercase tracking-widest">
                Upgrade to Pro
              </Button>
              <p className="text-xs text-center text-muted-foreground">Includes a 3-day Free Trial</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };
}
