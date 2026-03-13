"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Crown,
  ArrowLeft,
  Zap,
  Shield,
  MessageSquare,
  BookOpen,
  FileText,
  Globe,
  Swords,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number], delay: i * 0.08 },
  }),
};

const FREE_FEATURES = [
  { icon: MessageSquare, text: "3 speeches & AI analysis per day" },
  { icon: BookOpen, text: "5 quiz sessions per day" },
  { icon: Swords, text: "1 debate simulation per day" },
  { icon: Zap, text: "1 crisis simulation per day" },
  { icon: FileText, text: "Dual Library (upload & store)" },
  { icon: Globe, text: "Global Repository (read-only)" },
];

const PRO_FEATURES = [
  { icon: MessageSquare, text: "Unlimited speeches & AI analysis" },
  { icon: BookOpen, text: "Unlimited quiz sessions" },
  { icon: Swords, text: "Unlimited debate simulations + AI Rebuttal Engine" },
  { icon: Zap, text: "Unlimited crisis simulations" },
  { icon: FileText, text: "Advanced dossier export (PDF)" },
  { icon: Globe, text: "Priority Global Repository access" },
  { icon: Shield, text: "Priority support" },
  { icon: Sparkles, text: "Early access to new features" },
];

const COMPARISON = [
  { feature: "Speeches & AI Feedback", free: "3 / day", pro: "Unlimited" },
  { feature: "Quiz Arena Sessions", free: "5 / day", pro: "Unlimited" },
  { feature: "Debate Simulations", free: "1 / day", pro: "Unlimited" },
  { feature: "AI Rebuttal Engine", free: false, pro: true },
  { feature: "Crisis Simulations", free: "1 / day", pro: "Unlimited" },
  { feature: "Dual Library", free: true, pro: true },
  { feature: "Global Repository", free: "Read-only", pro: "Full access" },
  { feature: "PDF Export", free: false, pro: true },
  { feature: "Priority Support", free: false, pro: true },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const router = useRouter();

  const price = billing === "monthly" ? 8 : Math.round((80 / 12) * 10) / 10;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold text-lg">M</div>
          <span className="font-playfair font-bold text-base tracking-wide hidden sm:block">SAVE MY CONFERENCE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-16 text-center">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-6"
        >
          <Crown className="w-3 h-3" /> Simple, Transparent Pricing
        </motion.div>
        <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="font-playfair text-5xl md:text-6xl font-bold mb-4"
        >
          Invest in your diplomacy
        </motion.h1>
        <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
          className="text-muted-foreground text-lg max-w-xl mx-auto mb-10"
        >
          Start free forever. Upgrade to Pro for unlimited access to every module when you're ready to go all-in.
        </motion.p>

        {/* Billing toggle */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
          className="inline-flex bg-muted/50 p-1 rounded-full border border-border"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billing === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billing === "annual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            Annual
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wide">Save 16%</span>
          </button>
        </motion.div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="pb-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

          {/* Free */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-3xl border border-border bg-card p-8 flex flex-col gap-6"
          >
            <div>
              <h2 className="font-geist font-bold text-2xl mb-1">Observer</h2>
              <p className="text-muted-foreground text-sm">Everything you need to get started in MUN.</p>
            </div>
            <div className="font-playfair">
              <span className="text-6xl font-black">$0</span>
              <span className="text-xl font-medium text-muted-foreground ml-1">/mo</span>
            </div>
            <ul className="flex flex-col gap-3">
              {FREE_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3 h-3" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="mt-auto block text-center py-3.5 rounded-full border border-border text-sm font-semibold hover:bg-muted/40 transition-all"
            >
              Start for Free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-3xl border-2 border-primary bg-primary/5 p-8 flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
              Most Popular
            </div>
            <div>
              <h2 className="font-geist font-bold text-2xl text-primary mb-1">Senior Diplomat</h2>
              <p className="text-muted-foreground text-sm">Unlimited access for the delegate who means business.</p>
            </div>
            <div className="font-playfair">
              <span className="text-6xl font-black">${price}</span>
              <span className="text-xl font-medium text-muted-foreground ml-1">/mo</span>
              {billing === "annual" && (
                <p className="text-xs text-muted-foreground mt-1 font-sans">Billed as $80/year</p>
              )}
            </div>
            <ul className="flex flex-col gap-3">
              {PRO_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3 h-3 text-primary" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Button
                className="w-full py-6 rounded-full bg-primary text-primary-foreground font-geist font-semibold text-sm hover:bg-primary/90 shadow-md"
                onClick={() => {
                  router.push(`/checkout?billing=${billing}`);
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro — ${billing === "monthly" ? "8/mo" : "80/yr"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Includes a <span className="text-primary font-semibold">3-day free trial</span> · No card required to start
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-20 px-6 md:px-16 bg-muted/20 border-y border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold text-center mb-12">Full feature comparison</h2>
          <div className="rounded-3xl border border-border overflow-hidden bg-card">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border px-6 py-4 bg-muted/30">
              <span className="text-sm font-semibold text-muted-foreground">Feature</span>
              <span className="text-sm font-semibold text-center">Observer</span>
              <span className="text-sm font-semibold text-center text-primary">Senior Diplomat</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 px-6 py-4 items-center ${i !== COMPARISON.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <span className="text-sm text-foreground font-medium">{row.feature}</span>
                <div className="flex justify-center">
                  {typeof row.free === "boolean" ? (
                    row.free ? (
                      <Check className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <span className="text-muted-foreground/40 text-xl leading-none">—</span>
                    )
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">{row.free}</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {typeof row.pro === "boolean" ? (
                    row.pro ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground/40 text-xl leading-none">—</span>
                    )
                  ) : (
                    <span className="text-xs text-primary font-semibold">{row.pro}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ / Trust ── */}
      <section className="py-20 px-6 md:px-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-3xl font-bold mb-4">Questions? We have answers.</h2>
          <p className="text-muted-foreground mb-12">Everything you need to know about the Pro plan.</p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              { q: "Do I need a credit card to try Pro?", a: "No. Your 3-day trial starts the moment you click Upgrade — no card required until the trial ends." },
              { q: "Can I cancel at any time?", a: "Yes. Cancel directly from your Settings page. You keep Pro access until the end of your billing period." },
              { q: "Is there a student discount?", a: "We're working on it! Reach out to us and we'll see what we can do for verified students." },
              { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe. More payment methods coming soon." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-semibold text-sm mb-2">{q}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
