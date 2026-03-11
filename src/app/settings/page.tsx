"use client";

import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sun, Moon, Check, Zap, Crown, Shield, BookOpen, MessageSquare } from "lucide-react";
import { useUsageStore, FREE_DAILY_LIMITS } from "@/hooks/use-usage";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const USAGE_ITEMS = [
  { key: "speeches" as const, label: "Speeches / Analysis", icon: MessageSquare },
  { key: "quizzes" as const, label: "Quiz Arena sessions", icon: BookOpen },
  { key: "debates" as const, label: "Debate simulations", icon: Shield },
  { key: "crisis" as const, label: "Crisis Simulator runs", icon: Zap },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { usage, isProUser, getRemainingToday } = useUsageStore();

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground text-lg">Manage your account, appearance, and subscription.</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6 max-w-3xl">

        {/* ── Appearance ── */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">Appearance</h3>
            <p className="text-muted-foreground text-sm mt-1">Choose your Command Center's visual identity.</p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() => setTheme("light")}
                className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left group ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/40"
                }`}
              >
                {theme === "light" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">THE ARCHIVE</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cream & Burgundy — elegant dossier</p>
                </div>
                {/* Mini preview */}
                <div className="w-full h-12 rounded-xl overflow-hidden flex gap-1.5 p-2" style={{ background: "#FDFBF7" }}>
                  <div className="w-1/4 h-full rounded-lg" style={{ background: "#F0E8DF" }} />
                  <div className="flex-1 flex flex-col gap-1 justify-center px-1">
                    <div className="h-1.5 w-3/4 rounded-full" style={{ background: "#800020", opacity: 0.7 }} />
                    <div className="h-1 w-1/2 rounded-full" style={{ background: "#6B6B6B", opacity: 0.4 }} />
                  </div>
                </div>
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => setTheme("dark")}
                className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left group ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/40"
                }`}
              >
                {theme === "dark" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-slate-200" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">THE WAR ROOM</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Navy & Burgundy — tactical command</p>
                </div>
                {/* Mini preview */}
                <div className="w-full h-12 rounded-xl overflow-hidden flex gap-1.5 p-2" style={{ background: "#0B1221" }}>
                  <div className="w-1/4 h-full rounded-lg" style={{ background: "#131E35" }} />
                  <div className="flex-1 flex flex-col gap-1 justify-center px-1">
                    <div className="h-1.5 w-3/4 rounded-full" style={{ background: "#A0002A", opacity: 0.8 }} />
                    <div className="h-1 w-1/2 rounded-full" style={{ background: "#94A3B8", opacity: 0.4 }} />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Profile ── */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">Profile Information</h3>
            <p className="text-sm text-muted-foreground mt-1">Update your delegate credentials.</p>
          </div>
          <div className="p-8 flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold text-2xl shrink-0">N</div>
              <div>
                <p className="font-semibold text-foreground">Nicolas Saridar</p>
                <p className="text-sm text-muted-foreground">Administrator · Free Plan</p>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input defaultValue="Nicolas Saridar" className="rounded-2xl border-border max-w-md h-11" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input defaultValue="nicolas@example.com" type="email" className="rounded-2xl border-border max-w-md h-11" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input type="password" value="••••••••" className="rounded-2xl border-border max-w-md h-11" readOnly />
              <button className="text-sm text-primary hover:underline w-fit">Change Password</button>
            </div>
            <Button className="rounded-full w-fit px-8 bg-foreground text-background hover:bg-foreground/90 mt-2">
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* ── Daily Usage ── */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-geist font-semibold text-xl text-foreground">Daily Usage</h3>
              <p className="text-sm text-muted-foreground mt-1">Limits reset every day at midnight.</p>
            </div>
            {isProUser ? (
              <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-3 h-3" /> Pro Plan
              </div>
            ) : (
              <div className="px-4 py-2 rounded-full border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">Free Plan</div>
            )}
          </div>
          <div className="p-8 flex flex-col gap-4">
            {USAGE_ITEMS.map(({ key, label, icon: Icon }) => {
              const remaining = getRemainingToday(key);
              const limit = FREE_DAILY_LIMITS[key];
              const used = isProUser ? 0 : Math.max(0, limit - remaining);
              const pct = isProUser ? 0 : Math.round((used / limit) * 100);
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {isProUser ? "∞" : `${used} / ${limit} today`}
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-destructive" : "bg-primary"}`}
                        style={{ width: isProUser ? "0%" : `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Subscription ── */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">Subscription & Billing</h3>
            <p className="text-sm text-muted-foreground mt-1">Upgrade for unlimited access to every module.</p>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="flex flex-col rounded-3xl border border-border bg-muted/20 p-7">
              <h4 className="font-geist font-bold text-lg">Observer</h4>
              <div className="mt-3 flex items-baseline font-playfair">
                <span className="text-5xl font-black">$0</span>
                <span className="text-xl font-medium text-muted-foreground ml-1">/mo</span>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {[
                  `${FREE_DAILY_LIMITS.quizzes} quizzes per day`,
                  `${FREE_DAILY_LIMITS.speeches} speeches per day`,
                  `${FREE_DAILY_LIMITS.debates} debate simulation per day`,
                  `${FREE_DAILY_LIMITS.crisis} crisis simulations per day`,
                ].map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-8 w-full rounded-full" disabled>Current Plan</Button>
            </div>

            {/* Pro Tier */}
            <div className="flex flex-col rounded-3xl border-2 border-primary bg-primary/5 p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                Recommended
              </div>
              <h4 className="font-geist font-bold text-lg text-primary">Senior Diplomat</h4>
              <div className="mt-3 font-playfair">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black">$8</span>
                  <span className="text-xl font-medium text-muted-foreground ml-1">/mo</span>
                </div>
                <span className="text-xs text-muted-foreground">or $80/yr — save 16%</span>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {[
                  "Unlimited speeches & AI analysis",
                  "Unlimited crisis simulations",
                  "Unlimited quiz sessions",
                  "AI Rebuttal Engine in Debate Arena",
                  "Priority Global Repository access",
                  "Advanced dossier export (PDF)",
                ].map((f) => (
                  <li key={f} className="flex gap-3 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-2">
                <Button className="w-full rounded-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-geist font-semibold tracking-wide">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
                <p className="text-center text-xs text-muted-foreground">Includes a 3-day free trial · No card required</p>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
