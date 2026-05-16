/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  Skull,
  Radio,
  Activity,
  Terminal as TerminalIcon,
  Swords
} from "lucide-react";
import { UseConference } from "../../../contexts/ConferenceContext";

const loadingMessages = [
  "Analyzing Delegate Profiles...",
  "Reviewing Committee Guidelines...",
  "Synthesizing Research Documents...",
  "Formulating Opening Statements...",
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function DebateArena() {
  const [difficulty, setDifficulty] = useState<string>("Constructive");
  const [simulationData, setSimulationData] = useState<Record<string, unknown> | null>(null);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [directive, setDirective] = useState("");
  const [fetchingResults, setFetchingResults] = useState<boolean>(false);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { conference } = UseConference();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (eventsLoading) {
      interval = setInterval(() => {
        setLoadingStep((s) => (s + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [eventsLoading]);

  const startSimulation = () => {
    if (!conference?.id) {
      setError("Please select a conference first in the header.");
      return;
    }
    setError(null);
    setEventsLoading(true);
    setResults(null);
    setSimulationData(null);

    // Mock API call for scenario generation
    setTimeout(() => {
      setSimulationData({
        scenario_title: "Operation Cyber-Sovereignty",
        opponent_country: "China",
        topic: "Implementation of binding multilateral frameworks for cyber-sovereignty and international data protection standards.",
        global_context: "Global tensions are high regarding data privacy.",
        initial_argument: {
          severity: "HIGH",
          region: "ASIA",
          text: `The delegation of ${conference?.country || "your country"} fails to recognize the fundamental sovereign rights involved in this topic. While their proposition on cyber-sovereignty sounds noble, it ignores the practical implementation challenges we've outlined in our position paper. Specifically, the framework doesn't account for national security protocols...`
        },
        threat_actors: ["China", "Russian Federation"],
        intelligence: {
          weakPoints: ["Lack of clear definitions on 'cyber-attack'", "Ambiguous enforcement mechanisms"]
        }
      });
      setEventsLoading(false);
    }, 4500);
  };

  const handleSubmit = () => {
    if (!directive.trim()) return;
    setError(null);
    setFetchingResults(true);

    // Mock API call for grading/evaluation
    setTimeout(() => {
      setResults({
        overall_grade: "A-",
        total_score: 92,
        master_verdict: "Strong Defense",
        in_character_briefing: "Your rebuttal successfully neutralized the opponent's core argument while maintaining diplomatic poise. The emphasis on collaborative enforcement mechanisms resonated well with the neutral bloc.",
        event_outcomes: [
          { event_id: 0, status: "Resolved", impact_note: "Opponent's attack successfully deflected." }
        ],
        feedback: {
          strengths: ["Clear logical structure", "Strong use of precedents", "Diplomatic tone"],
          weaknesses: ["Could use more statistical backing", "Slightly verbose"],
          strategic_tip: "Focus on leveraging allied support in your next rebuttal to overwhelm isolated opposition."
        }
      });
      setFetchingResults(false);
    }, 3000);
  };

  const resetSimulation = () => {
    setSimulationData(null);
    setResults(null);
    setDirective("");
    setError(null);
  };

  // ─── LANDING ───────────────────────────────────────────────────────────────
  if (!simulationData && !eventsLoading) {
    return (
      <div className="flex flex-col gap-8 pb-8 items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl font-playfair font-bold tracking-tight">The Debate Arena</h1>
            <p className="text-muted-foreground text-xl">
              Master the floor by simulating high-stakes diplomatic confrontation.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["Constructive", "Rebuttal", "Hostile"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                  difficulty === level
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                {level === "Constructive" && <Shield className="w-8 h-8" />}
                {level === "Rebuttal" && <Zap className="w-8 h-8" />}
                {level === "Hostile" && <Skull className="w-8 h-8" />}
                <span className="font-bold text-lg">{level}</span>
                <span className="text-xs opacity-60">
                  {level === "Constructive" && "Structured & Foundational"}
                  {level === "Rebuttal" && "Dynamic & Tactical"}
                  {level === "Hostile" && "Aggressive Interrogation"}
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={startSimulation}
            className="w-full py-8 rounded-3xl text-xl font-bold bg-primary hover:bg-primary/90 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
          >
            Enter Arena <ChevronRight className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── LOADING ───────────────────────────────────────────────────────────────
  if (eventsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 py-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20"
        >
          <Swords className="w-12 h-12 text-primary" />
        </motion.div>
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-foreground">
            {loadingMessages[loadingStep]}
          </h2>
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Preparing diplomatic battlefield...</p>
        </div>
      </div>
    );
  }

  // ─── SIMULATION ACTIVE ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-playfair font-bold">{(simulationData as any).scenario_title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-wider">
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">Mode: {difficulty}</span>
              <span>•</span>
              <span className="truncate max-w-sm">{(simulationData as any).topic}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={resetSimulation} className="rounded-full">
          Withdraw
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Events + Response */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Intelligence Feed */}
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              <motion.div
                variants={item}
                className={`p-6 rounded-3xl border-l-4 bg-card shadow-sm border-l-primary`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase border bg-primary/10 text-primary border-primary/20">
                      Opponent: {(simulationData as any).opponent_country}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Opening Statement
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <Radio className="w-3 h-3" /> T+00M
                  </span>
                </div>
                <div className="text-foreground leading-relaxed text-sm font-medium italic border-l-2 border-primary/20 pl-4 py-2 my-2">
                  &quot;{(simulationData as any).initial_argument.text}&quot;
                </div>
              </motion.div>
          </motion.div>

          {/* Response input — hide after results are shown */}
          {!results && (
            <div className="bg-card rounded-3xl border border-border/50 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <TerminalIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Rebuttal Protocol</h3>
              </div>
              <textarea
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="Draft and execute a comprehensive rebuttal..."
                className="min-h-[200px] bg-background/50 border border-border/30 rounded-2xl p-6 font-mono text-sm resize-none focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">
                  Submit a response dismantling the opponent&apos;s core arguments.
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!directive.trim() || fetchingResults}
                  className="px-8 rounded-full"
                >
                  {fetchingResults ? "Analyzing Strategy..." : "Deliver Speech"}
                </Button>
              </div>
            </div>
          )}

          {/* After-Action Report */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Success banner */}
              <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-4 text-green-600 font-bold">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                Rebuttal delivered. After-Action Report compiled below.
              </div>

              {/* Strengths / Weaknesses / Tip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl border border-green-500/20 bg-green-500/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-4">
                    Strategic Strengths
                  </h4>
                  <ul className="text-xs space-y-2">
                    {((results as any).feedback?.strengths ?? []).map((s: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-3xl border border-destructive/20 bg-destructive/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-destructive mb-4">
                    Critical Weaknesses
                  </h4>
                  <ul className="text-xs space-y-2">
                    {((results as any).feedback?.weaknesses ?? []).map((w: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4">
                    Chair&apos;s Strategic Tip
                  </h4>
                  <p className="text-xs leading-relaxed">{(results as any).feedback?.strategic_tip}</p>
                </div>
              </div>

              <Button variant="outline" onClick={resetSimulation} className="w-full rounded-full">
                New Debate
              </Button>
            </motion.div>
          )}
        </div>

        {/* Right: Strategic Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl border border-border/50 bg-card p-6 space-y-6">
            <h3 className="font-bold border-b border-border/50 pb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Debate Dashboard
            </h3>

            <div className="space-y-4">
              {/* Threat Actors */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground">Opposing Bloc</span>
                <div className="flex flex-wrap gap-2">
                  {((simulationData as any).threat_actors ?? []).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-destructive/10 text-destructive text-[10px] font-bold border border-destructive/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Intelligence Focus */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  Debate Focus Areas
                </span>
                <p className="text-xs font-medium text-foreground pt-1">
                  {((simulationData as any).intelligence?.weakPoints?.length ?? 0) > 0
                    ? (simulationData as any).intelligence.weakPoints.join(", ")
                    : "General Policy Discourse"}
                </p>
              </div>

              {/* Risk Level */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Intensity</span>
                  <p className="text-lg font-bold text-foreground">
                    {difficulty === "Hostile" ? "CRITICAL" : difficulty === "Rebuttal" ? "HIGH" : "MEDIUM"}
                  </p>
                </div>
                {!results && (
                  <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                )}
                {results && <CheckCircle2 className="w-10 h-10 text-green-500" />}
              </div>
            </div>
          </div>

          {/* Final Verdict */}
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Debate Score</h3>
                <span className="text-4xl font-black text-primary">{(results as any).overall_grade}</span>
              </div>
              <div className="p-4 rounded-2xl bg-background/50 border border-primary/10 italic text-sm text-foreground/90 leading-relaxed">
                &ldquo;{(results as any).in_character_briefing}&rdquo;
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Outcome</span>
                <span className="font-bold text-foreground">{(results as any).master_verdict}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Total Score</span>
                <span className="font-bold text-foreground">{(results as any).total_score} / 100</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
