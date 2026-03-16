"use client";

import { motion, type Variants } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sun,
  Moon,
  Check,
  Zap,
  Crown,
  Shield,
  BookOpen,
  MessageSquare,
  LogOut,
  Info,
  Monitor,
  Smartphone,
} from "lucide-react";
import { useUsageStore, FREE_DAILY_LIMITS } from "@/hooks/use-usage";
import { useLayoutSettings } from "@/hooks/use-layout-settings";
import { UseUser } from "../../../contexts/UserContext";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Usage } from "@prisma/client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { format, subDays, eachDayOfInterval, startOfMonth, subMonths, eachMonthOfInterval } from "date-fns";
import { Activity, Calendar } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const USAGE_ITEMS = [
  {
    key: "speeches" as const,
    label: "Speeches / Analysis",
    icon: MessageSquare,
  },
  { key: "quizzes" as const, label: "Quiz Arena sessions", icon: BookOpen },
  { key: "debates" as const, label: "Debate simulations", icon: Shield },
  { key: "crisis" as const, label: "Crisis Simulator runs", icon: Zap },
];

export default function Settings() {
  const { theme, setTheme: setNextTheme } = useTheme();
  const router = useRouter();
  const { user, updatePreferences } = UseUser();
  const { layoutMode, setLayoutMode: setNextLayoutMode } = useLayoutSettings();

  const handleThemeChange = (newTheme: string) => {
    setNextTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  const handleLayoutChange = (newMode: LayoutMode) => {
    setNextLayoutMode(newMode);
    updatePreferences({ layoutMode: newMode });
  };
  const [dbUsage, setDbUsage] = useState<Usage | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<"day" | "month" | "year">("day");

  const fetchUsageData = async () => {
    if (!user?.id) return;
    try {
      const [usageRes, historyRes] = await Promise.all([
        axios.get(`/api/user/usage/${user.id}`),
        axios.get(`/api/user/usage/history`)
      ]);
      setDbUsage(usageRes.data.usage);
      setHistory(historyRes.data.usage);
    } catch (error) {
      console.error("Failed to fetch usage data", error);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, [user]);

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    const now = new Date();

    if (timeframe === "day") {
      const days = eachDayOfInterval({ start: subDays(now, 13), end: now });
      return days.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayUsage = history.filter((u: any) => format(new Date(u.createdAt), "yyyy-MM-dd") === dayStr);
        return {
          name: format(day, "MMM dd"),
          requests: dayUsage.length,
          tokens: dayUsage.reduce((sum: number, u: any) => sum + u.totalTokens, 0),
        };
      });
    }

    if (timeframe === "month") {
      const months = Array.from({ length: 12 }, (_, i) => subMonths(now, 11 - i));
      return months.map(month => {
        const mStr = format(month, "yyyy-MM");
        const monthUsage = history.filter((u: any) => format(new Date(u.createdAt), "yyyy-MM") === mStr);
        return {
          name: format(month, "MMM"),
          requests: monthUsage.length,
          tokens: monthUsage.reduce((sum: number, u: any) => sum + u.totalTokens, 0),
        };
      });
    }

    if (timeframe === "year") {
      const years = [now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear()];
      return years.map(y => {
        const yearUsage = history.filter((u: any) => new Date(u.createdAt).getFullYear() === y);
        return {
          name: y.toString(),
          requests: yearUsage.length,
          tokens: yearUsage.reduce((sum: number, u: any) => sum + u.totalTokens, 0),
        };
      });
    }

    return [];
  }, [history, timeframe]);

  const isPro = user?.role === "PRO" || user?.role === "ADMIN";
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-muted-foreground text-lg">
          Manage your account, appearance, and subscription.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6 max-w-3xl"
      >
        {/* ── Appearance ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Appearance
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Choose your Command Center's visual identity.
            </p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() => handleThemeChange("light")}
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
                  <p className="font-semibold text-foreground text-sm">
                    THE ARCHIVE
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cream & Burgundy — elegant dossier
                  </p>
                </div>
                {/* Mini preview */}
                <div
                  className="w-full h-12 rounded-xl overflow-hidden flex gap-1.5 p-2"
                  style={{ background: "#FDFBF7" }}
                >
                  <div
                    className="w-1/4 h-full rounded-lg"
                    style={{ background: "#F0E8DF" }}
                  />
                  <div className="flex-1 flex flex-col gap-1 justify-center px-1">
                    <div
                      className="h-1.5 w-3/4 rounded-full"
                      style={{ background: "#800020", opacity: 0.7 }}
                    />
                    <div
                      className="h-1 w-1/2 rounded-full"
                      style={{ background: "#6B6B6B", opacity: 0.4 }}
                    />
                  </div>
                </div>
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => handleThemeChange("dark")}
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
                  <p className="font-semibold text-foreground text-sm">
                    THE WAR ROOM
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Navy & Burgundy — tactical command
                  </p>
                </div>
                {/* Mini preview */}
                <div
                  className="w-full h-12 rounded-xl overflow-hidden flex gap-1.5 p-2"
                  style={{ background: "#0B1221" }}
                >
                  <div
                    className="w-1/4 h-full rounded-lg"
                    style={{ background: "#131E35" }}
                  />
                  <div className="flex-1 flex flex-col gap-1 justify-center px-1">
                    <div
                      className="h-1.5 w-3/4 rounded-full"
                      style={{ background: "#A0002A", opacity: 0.8 }}
                    />
                    <div
                      className="h-1 w-1/2 rounded-full"
                      style={{ background: "#94A3B8", opacity: 0.4 }}
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Device Optimization ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Device Optimization
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Adjust how the interface fits on your screen.
            </p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleLayoutChange("adaptive")}
                className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left group ${
                  layoutMode === "adaptive"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/40"
                }`}
              >
                {layoutMode === "adaptive" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Adaptive Mode
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Recommended for tablets & laptops.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleLayoutChange("mobile-optimized")}
                className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 transition-all text-left group ${
                  layoutMode === "mobile-optimized"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/40"
                }`}
              >
                {layoutMode === "mobile-optimized" && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Phone Mode
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Compacted layout for small screens.
                  </p>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
              <Info className="w-3.5 h-3.5" />
              This forces a "tight" fit regardless of screen size.
            </p>
          </div>
        </motion.div>

        {/* ── Profile ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Profile Information
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Update your delegate credentials.
            </p>
          </div>
          <div className="p-8 flex flex-col gap-5">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold text-2xl shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider text-[10px] font-black">
                  {user?.role} Plan
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Display Name
              </label>
              <Input
                defaultValue={user?.name || ""}
                className="rounded-2xl border-border max-w-md h-11"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                defaultValue={user?.email || ""}
                type="email"
                className="rounded-2xl border-border max-w-md h-11"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                type="password"
                value="••••••••"
                className="rounded-2xl border-border max-w-md h-11"
                readOnly
              />
              <button className="text-sm text-primary hover:underline w-fit">
                Change Password
              </button>
            </div>
            <Button className="rounded-full w-fit px-8 bg-foreground text-background hover:bg-foreground/90 mt-2">
              Save Changes
            </Button>
          </div>
        </motion.div>

        {/* ── Daily Usage ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-geist font-semibold text-xl text-foreground">
                Daily Usage
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Limits reset every day at midnight.
              </p>
            </div>
            {isPro ? (
              <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Crown className="w-3 h-3" /> {user?.role} Plan
              </div>
            ) : (
              <div className="px-4 py-2 rounded-full border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                Free Plan
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col gap-6">
            {/* Timeframe Selector */}
            <div className="flex items-center justify-between">
              <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
                {(["day", "month", "year"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      timeframe === t 
                        ? "bg-card text-primary shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-black text-muted-foreground flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Historical Activity
              </div>
            </div>

            {/* Chart */}
            <div className="h-[200px] w-full bg-muted/10 rounded-2xl border border-border/50 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    dy={10}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-card border border-border p-3 rounded-xl shadow-xl">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">{label}</p>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-sm font-black text-primary">
                                {payload[0].value} Requests
                              </p>
                              <p className="text-[10px] font-medium text-muted-foreground">
                                {payload[0].payload.tokens.toLocaleString()} Tokens
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsage)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {USAGE_ITEMS.map(({ key, label, icon: Icon }) => {
                const limit = FREE_DAILY_LIMITS[key];
                const used = dbUsage ? (dbUsage as any)[`${key}Count`] || 0 : 0;
                const remaining = Math.max(0, limit - used);
                const pct = isPro ? 0 : Math.round((used / limit) * 100);
                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-sm font-medium text-foreground">
                          {label}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {isPro ? `${used} / ∞` : `${used} / ${limit} today`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-destructive" : "bg-primary"}`}
                          style={{ width: isPro ? "0%" : `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Subscription ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border/50">
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Subscription & Billing
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upgrade for unlimited access to every module.
            </p>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-6">
            {/* Free Tier */}
            <div className="flex flex-col rounded-3xl border border-border bg-muted/20 p-7">
              <h4 className="font-geist font-bold text-lg">Observer</h4>
              <div className="mt-3 flex items-baseline font-playfair">
                <span className="text-5xl font-black">$0</span>
                <span className="text-xl font-medium text-muted-foreground ml-1">
                  /mo
                </span>
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {[
                  `${FREE_DAILY_LIMITS.quizzes} quizzes per day`,
                  `${FREE_DAILY_LIMITS.speeches} speeches per day`,
                  `${FREE_DAILY_LIMITS.debates} debate simulation per day`,
                  `${FREE_DAILY_LIMITS.crisis} crisis simulations per day`,
                ].map((f) => (
                  <li
                    key={f}
                    className="flex gap-3 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-8 w-full rounded-full"
                disabled
              >
                Current Plan
              </Button>
            </div>

            {/* Pro Tier */}
            <div className={`flex flex-col rounded-3xl border-2 p-7 relative overflow-hidden ${isPro ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              {isPro && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                  Active
                </div>
              )}
              <h4 className="font-geist font-bold text-lg text-primary">
                Senior Diplomat
              </h4>
              <div className="mt-3 font-playfair">
                <div className="flex items-baseline">
                  <span className="text-5xl font-black">$8</span>
                  <span className="text-xl font-medium text-muted-foreground ml-1">
                    /mo
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  or $80/yr — save 16%
                </span>
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
                <p className="text-center text-xs text-muted-foreground">
                  Includes a 3-day free trial · No card required
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Sign Out ── */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-destructive/20 bg-destructive/5 shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-destructive/10">
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Sign Out
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              End your current session and return to the login screen.
            </p>
          </div>
          <div className="p-8">
            <Button
              variant="outline"
              className="rounded-full border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2"
              onClick={() => {
                sessionStorage.removeItem("user");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
