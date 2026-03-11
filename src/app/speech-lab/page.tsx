"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";
import { useUsageStore } from "@/hooks/use-usage";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Clock, Plus, Save, FileText, Sparkles, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const MOCK_ANALYSIS = {
  grade: "B+",
  wpmScore: 148,
  tips: [
    { type: "strength" as const, text: "Strong opening hook that frames the urgency of the issue effectively." },
    { type: "strength" as const, text: "Clear use of operative language appropriate for UNSC context." },
    { type: "warning" as const, text: "Avoid 'I' — use 'The delegation of France...' to maintain formal register." },
    { type: "warning" as const, text: "Section 2 is dense. Consider splitting into two paragraphs." },
    { type: "tip" as const, text: "Quote UN Charter Article 39 to strengthen legal authority." },
  ],
};

const TIP_ICONS = {
  strength: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
  tip: <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />,
};

const AnalyzeButton = withSubscriptionGate(({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium">
    <Sparkles className="w-4 h-4 mr-2" />
    Analyze Speech
  </Button>
), "speeches");

export default function SpeechLab() {
  const [text, setText] = useState("Honorable Chair, distinguished delegates,\n\nFrance stands before this esteemed council today to address a threat that transcends traditional borders: cybersecurity threats to international peace and security.\n\nIn an era where critical infrastructure and democratic processes can be compromised with a few keystrokes, we must recognize that cyber attacks represent a clear and present danger to global stability.");
  const { incrementUsage } = useUsageStore();
  const [analysis, setAnalysis] = useState<typeof MOCK_ANALYSIS | null>(null);
  const wpm = Math.round(text.split(/\s+/).filter((w) => w.length > 0).length / 2.5) || 0;

  const handleAnalyze = () => {
    incrementUsage("speeches");
    setAnalysis(MOCK_ANALYSIS);
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Speech Lab</h2>
          <p className="text-muted-foreground text-lg">Draft, refine, and practice your speeches</p>
        </div>
        <Button className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 font-geist">
          <Plus className="w-4 h-4 mr-2" />New Speech
        </Button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <motion.div variants={item} className="lg:col-span-3 rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex flex-col gap-4">
          <div>
            <h3 className="font-geist font-semibold text-xl text-foreground">Your Speeches</h3>
            <p className="text-sm text-muted-foreground">Saved drafts and revisions</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl border border-primary bg-primary/5 cursor-pointer flex flex-col gap-1.5">
              <span className="font-medium text-foreground truncate text-sm">Opening Statement - UNSC</span>
              <div className="flex text-xs text-muted-foreground items-center gap-1"><Clock className="w-3 h-3" /> 3:00 est</div>
            </div>
            <div className="p-4 rounded-2xl border border-transparent hover:bg-muted/50 cursor-pointer transition-colors flex flex-col gap-1.5">
              <span className="font-medium text-foreground truncate text-sm">Working Paper Alpha Defense</span>
              <div className="flex text-xs text-muted-foreground items-center gap-1"><Clock className="w-3 h-3" /> 1:45 est</div>
            </div>
          </div>
        </motion.div>

        {/* Main Editor */}
        <motion.div variants={item} className="lg:col-span-9 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/50 flex-wrap gap-4">
            <div>
              <h3 className="font-geist font-bold text-xl text-foreground">Editing Speech</h3>
              <p className="text-sm text-muted-foreground">United Nations Security Council</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-4 py-2 rounded-full bg-secondary/50 text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /><span className="font-mono">{wpm}s</span>
              </div>
              <AnalyzeButton onClick={handleAnalyze} />
              <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Save className="w-4 h-4 mr-2" />Save
              </Button>
            </div>
          </div>

          <div className="flex bg-muted/30 p-1 rounded-full w-fit">
            <div className="px-5 py-2 rounded-full bg-background shadow-sm text-sm font-medium border border-border/50 flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" /> Editor
            </div>
            <div className="px-5 py-2 rounded-full text-muted-foreground text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
              <Clock className="w-4 h-4" /> Practice
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-background/50 rounded-2xl border border-border/50 p-6 flex flex-col min-h-[280px]">
              <input
                type="text"
                className="w-full bg-transparent font-playfair text-xl font-bold border-0 outline-none mb-4 text-foreground placeholder:text-muted-foreground/30"
                placeholder="Speech Title..."
                defaultValue="Opening Statement - UNSC"
              />
              <textarea
                className="w-full flex-1 bg-transparent border-0 outline-none resize-none font-geist text-base leading-loose text-foreground placeholder:text-muted-foreground/30 min-h-[200px]"
                placeholder="Honorable Chair, fellow delegates..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <AnimatePresence>
                {analysis && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Grade</p>
                        <span className="text-5xl font-playfair font-black text-primary">{analysis.grade}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Est. WPM</p>
                        <span className="text-3xl font-playfair font-bold text-foreground">{analysis.wpmScore}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/20 p-5 flex flex-col gap-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Feedback</p>
                      {analysis.tips.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                          {TIP_ICONS[t.type]}
                          <span>{t.text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!analysis && (
                <div className="flex-1 rounded-2xl border border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
                  <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Click <span className="text-primary font-medium">Analyze Speech</span> to get your grade, WPM estimate, and AI-powered suggestions.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
