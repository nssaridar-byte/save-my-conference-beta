"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";
import { useUsageStore } from "@/hooks/use-usage";
import { motion, type Variants } from "framer-motion";
import { Clock, Plus, Save, FileText, Sparkles } from "lucide-react";

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

const AnalyzeButton = withSubscriptionGate(({ onClick }: { onClick: () => void }) => {
    return (
      <Button onClick={onClick} className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 font-medium">
        <Sparkles className="w-4 h-4 mr-2" />
        Analyze Speech
      </Button>
    );
}, "speeches");

export default function SpeechLab() {
  const [text, setText] = useState("");
  const { incrementUsage } = useUsageStore();
  const wpm = Math.round(text.split(/\s+/).filter((word) => word.length > 0).length / 2.5) || 0;

  const handleAnalyze = () => {
     console.log("Analyzing speech...");
     incrementUsage("speeches");
  }

  return (
    <div className="flex flex-col gap-8 pb-8 h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Speech Lab</h2>
          <p className="text-muted-foreground text-lg">
            Draft, refine, and practice your speeches
          </p>
        </div>
        <Button className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 font-geist">
          <Plus className="w-4 h-4 mr-2" />
          New Speech
        </Button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0"
      >
        {/* Left Sidebar - Your Speeches */}
        <motion.div variants={item} className="lg:col-span-3 rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex flex-col gap-6">
          <h3 className="font-geist font-semibold text-xl text-foreground">Your Speeches</h3>
          <p className="text-sm text-muted-foreground -mt-4">Saved drafts and revisions</p>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            <div className="p-4 rounded-2xl border border-primary bg-primary/5 cursor-pointer flex flex-col gap-2">
              <span className="font-medium text-foreground truncate">Opening Statement - UNSC</span>
              <div className="flex text-xs text-muted-foreground items-center gap-1">
                <Clock className="w-3 h-3" /> 3:00 estimated
              </div>
            </div>
            
            <div className="p-4 rounded-2xl border border-transparent hover:bg-muted/50 cursor-pointer transition-colors flex flex-col gap-2">
              <span className="font-medium text-foreground truncate">Working Paper Alpha Defense</span>
              <div className="flex text-xs text-muted-foreground items-center gap-1">
                <Clock className="w-3 h-3" /> 1:45 estimated
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Editor */}
        <motion.div variants={item} className="lg:col-span-9 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div>
              <h3 className="font-geist font-bold text-xl text-foreground">Editing Speech</h3>
              <p className="text-sm text-muted-foreground">United Nations Security Council</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm px-4 py-2 rounded-full bg-secondary/50 text-secondary-foreground font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{wpm}s</span>
              </div>
              <AnalyzeButton onClick={handleAnalyze} />
              <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="flex bg-muted/30 p-1 rounded-full w-fit">
            <div className="px-6 py-2 rounded-full bg-background shadow-sm text-sm font-medium border border-border/50 flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" /> Editor
            </div>
            <div className="px-6 py-2 rounded-full text-muted-foreground text-sm font-medium flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
              <Clock className="w-4 h-4" /> Practice
            </div>
          </div>

          <div className="flex-1 bg-background/50 rounded-2xl border border-border/50 p-6 flex flex-col min-h-[300px]">
            <input 
              type="text" 
              className="w-full bg-transparent font-playfair text-2xl font-bold border-0 outline-none focus:ring-0 mb-4 text-foreground placeholder:text-muted-foreground/30"
              placeholder="Speech Title..."
              defaultValue="Opening Statement - UNSC"
            />
            <textarea
              className="w-full flex-1 bg-transparent border-0 outline-none focus:ring-0 resize-none font-geist text-lg leading-loose text-foreground placeholder:text-muted-foreground/30"
              placeholder="Honorable Chair, fellow delegates..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
