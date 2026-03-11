"use client";

import { motion, type Variants } from "framer-motion";
import { FileText, Trophy, Clock, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground text-lg">
          Welcome back, Nicolas Saridar
        </p>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min"
      >
        {/* Main Conference Card - Spans 2 columns */}
        <motion.div variants={item} className="md:col-span-2 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-geist font-semibold text-2xl text-foreground">Global MUN Summit 2026</h3>
              <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase">Active</div>
            </div>
            <p className="text-primary font-medium text-lg">Your active conference assignment</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Date</span>
                <span className="font-semibold text-foreground">April 15, 2026</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4"/> Location</span>
                <span className="font-semibold text-foreground">New York, USA</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Trophy className="w-4 h-4"/> Committee</span>
                <span className="font-semibold text-foreground">United Nations Security Council</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-2"><Target className="w-4 h-4"/> Representing</span>
                <span className="font-semibold text-foreground">France</span>
              </div>
            </div>

            <div className="mt-8 bg-background/50 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Topic</span>
              </div>
              <p className="text-foreground text-lg">Cybersecurity Threats to International Peace</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions / Status */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-geist font-semibold text-xl text-foreground mb-6">Preparation Status</h3>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground">Speeches Drafted</span>
                  <span className="text-2xl font-bold font-playfair">2</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[40%] rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground">Crisis Directives</span>
                  <span className="text-2xl font-bold font-playfair">3</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <Button className="w-full mt-8 rounded-full py-6 group">
            Continue Preparation
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Bottom Stat Row - 3 Bento items */}
        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <span className="text-sm text-muted-foreground">Speech Quality</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-5xl font-playfair font-bold text-foreground">A-</span>
            <Trophy className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <span className="text-sm text-muted-foreground">Quiz Performance</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-5xl font-playfair font-bold text-foreground">100%</span>
            <Target className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <span className="text-sm text-muted-foreground">Global Rank</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-5xl font-playfair font-bold text-foreground">Top 5%</span>
            <Trophy className="w-8 h-8 text-primary/20 group-hover:text-primary transition-colors" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
