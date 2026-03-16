"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import {
  Swords,
  Sparkles,
  Users,
  FileText,
  Globe,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";
import { useLibraryStore } from "@/hooks/use-library";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const RebuttalButton = withSubscriptionGate(
  ({ onClick, isLoading }: { onClick: () => void; isLoading?: boolean }) => (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-geist font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse" />
          Processing Strategy...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Enter the Arena
        </span>
      )}
    </Button>
  ),
  "debates",
  "debates",
);

export default function DebateArena() {
  const { documents } = useLibraryStore();
  const [yourCountry, setYourCountry] = useState("");
  const [opponentCountry, setOpponentCountry] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  const researchFiles = documents.filter((d) => d.type !== "Folder");

  const handleGenerateScenario = () => {
    setIsGeneratingScenario(true);
    // Mocking scenario generation
    setTimeout(() => {
      setOpponentCountry("China");
      setTopic(
        "Implementation of binding multilateral frameworks for cyber-sovereignty and international data protection standards.",
      );
      setIsGeneratingScenario(false);
    }, 1500);
  };

  const handleStartDebate = () => {
    if (!yourCountry || !opponentCountry || !topic) return;
    setIsSimulating(true);
    // Mocking AI response generation
    setTimeout(() => {
      setAiResponse(
        `### Opponent Rebuttal: ${opponentCountry}\n\n"The delegation of ${yourCountry} fails to recognize the fundamental sovereign rights involved in this topic. While their proposition on '${topic}' sounds noble, it ignores the practical implementation challenges we've outlined in our position paper. Specifically, the IAEA framework doesn't account for national security protocols..."`,
      );
      setIsSimulating(false);
    }, 2500);
  };

  const toggleFile = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  return (
    <div className="container mx-auto px-4 w-full min-h-[calc(100vh-8rem)] flex flex-col gap-10 pb-12">
      {/* Header Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm shadow-primary/5">
            <Swords className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-foreground tracking-tight">
              Arena
            </h1>
            <p className="text-muted-foreground font-geist text-lg">
              Master the floor by simulating high-stakes diplomatic confrontation.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
        {/* Left Column: Configuration */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8"
        >
          <motion.div
            variants={fadeUp}
            className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl shadow-foreground/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-playfair text-2xl font-bold">
                Scenario Intelligence
              </h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] uppercase tracking-[0.2em] font-black text-primary/70 ml-1">
                  Your Delegation
                </label>
                <input
                  placeholder="Identify your country (e.g. USA)"
                  value={yourCountry}
                  onChange={(e) => setYourCountry(e.target.value)}
                  className="w-full bg-muted/20 border border-border/80 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none font-medium shadow-inner"
                />
              </div>

              <div className="p-8 rounded-[2rem] bg-muted/5 border-2 border-dashed border-border/40 relative overflow-hidden group min-h-[200px] flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                  {opponentCountry || topic ? (
                    <motion.div
                      key="generated-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 w-full"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.25em]">
                          Assigned Opponent
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-primary rounded-full" />
                          <p className="font-playfair text-2xl font-bold text-foreground">
                            {opponentCountry}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.25em]">
                          Debate Motion
                        </span>
                        <div className="bg-background/40 backdrop-blur-sm p-5 rounded-2xl border border-border/40 shadow-sm">
                          <p className="text-base text-foreground/90 leading-relaxed italic font-serif">
                            "{topic}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-6 text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary/20" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-bold">Incomplete Mission Intel</p>
                        <p className="text-xs text-muted-foreground font-medium mt-1 max-w-[200px] mx-auto">
                          Let AI define your simulation parameters based on your research.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                onClick={handleGenerateScenario}
                disabled={isGeneratingScenario || !yourCountry}
                className={`w-full rounded-[1.5rem] py-8 group transition-all text-lg font-bold font-geist ${
                  opponentCountry
                    ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 shadow-lg shadow-primary/5"
                    : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/20"
                }`}
              >
                {isGeneratingScenario ? (
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Calculating Scenario...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {opponentCountry
                      ? "Regenerate Mission"
                      : "Generate Strategic Scenario"}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-card border border-border/60 rounded-[2.5rem] p-8 shadow-xl shadow-foreground/5 flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-playfair text-2xl font-bold">
                  Intelligence Feed
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full tracking-tighter">
                  {selectedFiles.length} SELECTED
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar min-h-[300px]">
              {researchFiles.length > 0 ? (
                researchFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => toggleFile(file.id)}
                    className={`w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all text-left group relative overflow-hidden ${
                      selectedFiles.includes(file.id)
                        ? "bg-primary/[0.03] border-primary/40 shadow-md translate-x-1"
                        : "bg-muted/10 border-transparent hover:border-border/60 hover:bg-muted/20"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        selectedFiles.includes(file.id)
                          ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-base font-bold truncate ${selectedFiles.includes(file.id) ? "text-primary" : "text-foreground"}`}
                      >
                        {file.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-70">
                        {file.type}
                      </p>
                    </div>
                    {selectedFiles.includes(file.id) && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-16 px-6 border-2 border-dashed border-border/40 rounded-[2rem] bg-muted/5 flex flex-col items-center justify-center h-full">
                  <AlertCircle className="w-10 h-10 text-muted-foreground/30 mb-4" />
                  <p className="text-base text-muted-foreground font-medium italic">
                    No research documents found.
                  </p>
                  <Button
                    variant="link"
                    className="text-primary font-bold text-sm mt-4 hover:no-underline"
                    onClick={() => (window.location.href = "/library")}
                  >
                    Upload intelligence now
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-10">
              <RebuttalButton
                onClick={handleStartDebate}
                isLoading={isSimulating}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: AI Opponent / Results */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:col-span-12 xl:col-span-7"
        >
          <div className="bg-card border border-border/60 rounded-[3rem] h-full shadow-2xl relative overflow-hidden flex flex-col group/arena min-h-[800px]">
            {/* Background Texture/Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none group-hover/arena:bg-primary/10 transition-colors duration-1000" />
            
            {/* Header of card */}
            <div className="flex items-center justify-between p-8 border-b border-border/40 bg-muted/5 rounded-t-[2.5rem]">
              <div className="flex items-center gap-6">
                <div className="w-1.5 h-10 bg-primary/40 rounded-full" />
                <div>
                  <h3 className="font-playfair text-3xl font-black text-foreground tracking-tight">
                    Strategic Analysis
                  </h3>
                  <div className="flex items-center gap-2.5 mt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                    <span className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.25em]">
                      Systems Nominal
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-2xl border-border/60 hover:bg-primary/5 group/btn">
                  <Sparkles className="w-5 h-5 text-primary group-hover/btn:scale-110 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-8 lg:p-10 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div
                    key="simulating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-8 py-20"
                  >
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full border-[6px] border-primary/5 border-t-primary animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Swords className="w-10 h-10 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-playfair text-2xl font-black text-foreground">
                        Decoding Stance...
                      </h4>
                      <p className="text-muted-foreground text-base max-w-[400px] leading-relaxed mx-auto font-geist">
                         Cross-referencing your research briefs with global committee guides.
                      </p>
                    </div>
                  </motion.div>
                ) : aiResponse ? (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-playfair prose-headings:text-primary"
                  >
                    <div className="space-y-2">
                      {aiResponse.split('\n').filter(line => line.trim() !== "").map((line, i) => {
                        if (line.startsWith('###')) {
                          return (
                            <div key={i} className="mb-8 pt-4">
                              <h3 className="text-3xl font-black tracking-tight text-primary">
                                {line.replace('###', '').trim()}
                              </h3>
                              <div className="w-20 h-1.5 bg-primary/20 rounded-full mt-2" />
                            </div>
                          );
                        }
                        return (
                          <p key={i} className="text-lg leading-relaxed text-foreground/80 font-geist mb-6">
                            {line.startsWith('"') ? <span className="italic opacity-90 border-l-4 border-primary/20 pl-6 block my-8 text-xl font-serif">"{line.replace(/"/g, '')}"</span> : line}
                          </p>
                        );
                      })}
                    </div>

                    <div className="mt-16 pt-10 border-t border-border/40">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-playfair text-2xl font-black tracking-tight">
                          Arena Tactics
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          "Challenge their OP3 clause using your research brief findings.",
                          "Pivote to humanitarian concerns to gain neutral bloc support.",
                          "Request a 1:1 unmoderated caucus with their key ally.",
                          "Utilize Point of Parliamentary Inquiry on their sovereignty claim."
                        ].map((tactic, i) => (
                          <div
                            key={i}
                            className="bg-muted/10 border border-border/40 rounded-[1.5rem] p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group/tactic"
                          >
                            <span className="text-primary font-black text-lg bg-primary/5 w-8 h-8 flex items-center justify-center rounded-lg group-hover/tactic:bg-primary group-hover/tactic:text-white transition-colors">
                              {i + 1}
                            </span>
                            <p className="text-sm text-foreground/80 font-bold leading-relaxed pt-1">
                              {tactic}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-10 opacity-30 py-20">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-[2.5rem] bg-muted/50 flex items-center justify-center border-4 border-dashed border-border/60 rotate-3" />
                      <div className="absolute inset-0 flex items-center justify-center -rotate-3">
                        <Swords className="w-20 h-20 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="font-playfair text-3xl font-black text-foreground uppercase tracking-widest">
                        Awaiting Conflict
                      </p>
                      <p className="text-lg text-muted-foreground font-geist font-medium">
                        Configure your mission on the left to begin the simulation.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle Footer inside card */}
            <div className="p-8 bg-muted/10 border-t border-border/40 rounded-b-[3rem] backdrop-blur-sm mt-auto">
              <div className="flex items-center justify-between text-[11px] font-black text-muted-foreground/50 tracking-[0.3em] uppercase">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary/30" />
                  <span>Model Intelligence v4.2</span>
                </div>
                <span>Ready for {yourCountry || "Delegate"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
