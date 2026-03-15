"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { 
  Swords, 
  Sparkles, 
  Users, 
  Mic, 
  FileText, 
  Globe, 
  ChevronRight, 
  BookOpen,
  CheckCircle2,
  AlertCircle
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

const RebuttalButton = withSubscriptionGate(({ onClick, isLoading }: { onClick: () => void; isLoading?: boolean }) => (
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
  "debates"
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

  const researchFiles = documents.filter(d => d.type !== 'Folder');

  const handleGenerateScenario = () => {
    setIsGeneratingScenario(true);
    // Mocking scenario generation
    setTimeout(() => {
      setOpponentCountry("China");
      setTopic("Implementation of binding multilateral frameworks for cyber-sovereignty and international data protection standards.");
      setIsGeneratingScenario(false);
    }, 1500);
  };

  const handleStartDebate = () => {
    if (!yourCountry || !opponentCountry || !topic) return;
    setIsSimulating(true);
    // Mocking AI response generation
    setTimeout(() => {
      setAiResponse(
        `### Opponent Rebuttal: ${opponentCountry}\n\n"The delegation of ${yourCountry} fails to recognize the fundamental sovereign rights involved in this topic. While their proposition on '${topic}' sounds noble, it ignores the practical implementation challenges we've outlined in our position paper. Specifically, the IAEA framework doesn't account for national security protocols..."`
      );
      setIsSimulating(false);
    }, 2500);
  };

  const toggleFile = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeUp}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Swords className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-playfair font-bold text-foreground">Arena</h1>
        </div>
        <p className="text-muted-foreground font-geist text-lg ml-1">
          Master the floor by simulating high-stakes diplomatic confrontation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Configuration */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6"
        >
          <motion.div variants={fadeUp} className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="font-playfair text-xl font-bold">Scenario Intelligence</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Your Delegation</label>
                <input 
                  placeholder="Identify your country (e.g. USA)"
                  value={yourCountry}
                  onChange={(e) => setYourCountry(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none"
                />
              </div>

              <div className="p-6 rounded-[1.5rem] bg-muted/5 border border-dashed border-border/60 relative overflow-hidden group">
                <AnimatePresence mode="wait">
                  {opponentCountry || topic ? (
                    <motion.div 
                      key="generated-content"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em]">Assigned Opponent</span>
                        <p className="font-playfair text-lg font-bold text-foreground">{opponentCountry}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.2em]">Debate Motion</span>
                        <p className="text-sm text-foreground/90 leading-relaxed italic">"{topic}"</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-4 text-center space-y-2"
                    >
                      <Sparkles className="w-6 h-6 text-primary/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground font-medium">Click below to let AI define your simulation parameters based on your research.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="outline"
                onClick={handleGenerateScenario}
                disabled={isGeneratingScenario || !yourCountry}
                className={`w-full rounded-xl py-6 group transition-all ${
                  opponentCountry 
                    ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10" 
                    : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 shadow-lg shadow-primary/5"
                }`}
              >
                {isGeneratingScenario ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Calculating Scenario...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {opponentCountry ? "Regenerate Mission" : "Generate Strategic Scenario"}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-playfair text-xl font-bold">Intelligence Feed</h2>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">{selectedFiles.length} SELECTED</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {researchFiles.length > 0 ? (
                researchFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => toggleFile(file.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                      selectedFiles.includes(file.id) 
                        ? 'bg-primary/5 border-primary/30 shadow-sm' 
                        : 'bg-muted/10 border-transparent hover:border-border/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      selectedFiles.includes(file.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selectedFiles.includes(file.id) ? 'text-primary' : 'text-foreground'}`}>
                        {file.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{file.type}</p>
                    </div>
                    {selectedFiles.includes(file.id) && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </button>
                ))
              ) : (
                <div className="text-center py-12 px-4 border border-dashed border-border rounded-3xl bg-muted/5">
                  <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground italic">No research documents found in your library.</p>
                  <Button variant="link" className="text-primary text-xs mt-2" onClick={() => window.location.href='/library'}>
                    Upload intelligence now
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <RebuttalButton onClick={handleStartDebate} isLoading={isSimulating} />
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: AI Opponent / Results */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="lg:col-span-12 xl:col-span-7 h-full min-h-[600px]"
        >
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-4 h-full shadow-2xl relative overflow-hidden flex flex-col">
            {/* Background Texture/Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-px h-8 bg-primary/30" />
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-foreground">Strategic Response</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Ready for Analysis</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted/50 transition-colors">
                <Sparkles className="w-5 h-5 text-primary" />
              </Button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div 
                    key="simulating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="font-playfair text-xl font-bold">Decoding Diplomatic Stance</h4>
                       <p className="text-muted-foreground text-sm max-w-[300px]">Our AI is cross-referencing your research briefs with global committee guides...</p>
                    </div>
                  </motion.div>
                ) : aiResponse ? (
                  <motion.div 
                    key="response"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-playfair prose-headings:text-primary"
                  >
                    <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>') }} />
                    
                    <div className="mt-12 pt-8 border-t border-border/30">
                      <h4 className="font-playfair text-lg font-bold mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Tactics & Rebuttals
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Challenge their OP3 clause using your research brief.",
                          "Pivote to humanitarian concerns to gain neutral bloc support.",
                          "Request a 1:1 unmoderated caucus with their key ally.",
                        ].map((tactic, i) => (
                          <div key={i} className="bg-muted/20 border border-border/50 rounded-2xl p-4 flex items-start gap-3">
                            <span className="text-primary font-bold">{i+1}.</span>
                            <p className="text-xs text-muted-foreground font-medium">{tactic}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-6 opacity-40">
                    <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center border-2 border-dashed border-border">
                      <Swords className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-playfair text-xl font-bold">Awaiting Conflict</p>
                      <p className="text-sm text-muted-foreground">Configure your mission on the left to begin the simulation.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Subtle Footer inside card */}
            <div className="p-6 bg-muted/5 border-t border-border/30 rounded-b-[2.5rem]">
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">
                <span>Model Intelligence v4.2</span>
                <span>Ready for {yourCountry || 'Delegate'}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
