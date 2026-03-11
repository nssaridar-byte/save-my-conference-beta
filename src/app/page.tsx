"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  BrainCircuit,
  Newspaper,
  Swords,
  FileText,
  ShieldAlert,
  ArrowRight,
  Check,
  Globe,
  Zap,
  Crown,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Speech Lab",
    description: "AI-powered speech generation and coaching. Draft, refine, and deliver with the confidence of a senior delegate.",
    color: "from-rose-500/20 to-rose-700/10",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: BrainCircuit,
    title: "Quiz Arena",
    description: "Adaptive knowledge challenges on resolutions, committees, and bloc dynamics. Never get caught off-guard again.",
    color: "from-violet-500/20 to-violet-700/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Newspaper,
    title: "Crisis Simulator",
    description: "React to live breaking crises, draft directives, and coordinate your bloc under pressure — in real time.",
    color: "from-amber-500/20 to-amber-700/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Swords,
    title: "Debate Arena",
    description: "Face off against an AI rebuttal engine. Sharpen your arguments and anticipate opposition moves before the conference.",
    color: "from-blue-500/20 to-blue-700/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: FileText,
    title: "Dual Library",
    description: "Upload, organise, and search your position papers, working papers, and country briefs — all linked to your committee.",
    color: "from-emerald-500/20 to-emerald-700/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe,
    title: "Global Repository",
    description: "Access a curated, community-built archive of resolutions, country profiles, and committee guides.",
    color: "from-cyan-500/20 to-cyan-700/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
];

const stats = [
  { value: "10K+", label: "Delegates trained" },
  { value: "500+", label: "Conferences covered" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "6", label: "AI-powered modules" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number], delay: i * 0.07 },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold text-lg">M</div>
          <span className="font-playfair font-bold text-base tracking-wide hidden sm:block">SAVE MY CONFERENCE</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 md:px-16 flex flex-col items-center text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary/8 via-primary/3 to-transparent pointer-events-none" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-8"
        >
          <Zap className="w-3 h-3" /> AI-Powered MUN Preparation
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-playfair text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6"
        >
          Your Diplomatic
          <span className="text-primary"> Command Center</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
        >
          The all-in-one AI suite for Model United Nations delegates. Prepare speeches, master debates, simulate crises, and walk into every committee room ready.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/login"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-geist font-semibold text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 border border-border text-foreground px-8 py-4 rounded-full font-geist font-semibold text-base hover:bg-muted/40 transition-all"
          >
            <Crown className="w-4 h-4 text-primary" /> View Pricing
          </Link>
        </motion.div>

        {/* Hero stats */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border/60 w-full max-w-3xl"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="font-playfair text-3xl font-bold text-primary">{s.value}</span>
              <span className="text-muted-foreground text-sm">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Six AI Modules</p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Everything a delegate needs</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From your first research session to the final vote — we have every stage covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={`group relative rounded-3xl border border-border bg-gradient-to-br ${f.color} p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-11 h-11 rounded-2xl bg-background/80 flex items-center justify-center mb-5 shadow-sm`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-geist font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="py-24 px-6 md:px-16 bg-muted/30 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Simple Pricing</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Start free. Upgrade when ready.</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-12">
            No credit card required. Full access to core features forever, with a Pro tier for delegates who mean business.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Free */}
            <div className="rounded-3xl border border-border bg-card p-8 flex flex-col gap-5">
              <div>
                <h3 className="font-geist font-bold text-xl mb-1">Observer</h3>
                <div className="font-playfair text-4xl font-black">$0<span className="text-lg font-medium text-muted-foreground">/mo</span></div>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {["5 speeches per day", "5 quizzes per day", "1 debate simulation / day", "1 crisis simulation / day", "Dual Library access"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-muted-foreground shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center py-3 rounded-full border border-border text-sm font-semibold hover:bg-muted/40 transition-all">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border-2 border-primary bg-primary/5 p-8 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                Recommended
              </div>
              <div>
                <h3 className="font-geist font-bold text-xl text-primary mb-1">Senior Diplomat</h3>
                <div className="font-playfair text-4xl font-black">$8<span className="text-lg font-medium text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground mt-1">or $80/yr — save 16%</p>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {["Unlimited speeches & analysis", "Unlimited crisis simulations", "Unlimited quiz sessions", "AI Rebuttal Engine in Debate Arena", "Priority Global Repository access", "Advanced dossier export (PDF)"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm font-medium">
                    <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                <Crown className="w-4 h-4 inline mr-2" />Upgrade to Pro
              </Link>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Includes a <span className="text-primary font-semibold">3-day free trial</span> of Pro. No credit card required.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="w-16 h-16 rounded-3xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-playfair font-bold text-3xl mb-8 shadow-lg">M</div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Ready to dominate the floor?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join thousands of delegates who prepare smarter with Save My Conference.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-10 py-4 rounded-full font-geist font-semibold text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
            >
              Begin Your Mission <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-playfair font-bold text-sm">M</div>
          <span className="font-playfair font-semibold text-foreground">Save My Conference</span>
        </div>
        <p>© {new Date().getFullYear()} Save My Conference. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
      </footer>
    </div>
  );
}
