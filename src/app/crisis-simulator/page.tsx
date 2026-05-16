"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Skull,
  Radio,
  Activity,
  Terminal as TerminalIcon,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { UseConference } from "../../../contexts/ConferenceContext";
import { UseUser } from "../../../contexts/UserContext";
import { Usage } from "@prisma/client";

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

const SEVERITY_STYLES: Record<string, string> = {
  LOW: "bg-muted text-muted-foreground border-border",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HIGH: "bg-primary/10 text-primary border-primary/20",
  CRITICAL: "bg-destructive/10 text-destructive border-destructive/20",
};

const SEVERITY_BORDER: Record<string, string> = {
  LOW: "border-l-muted-foreground/30",
  MEDIUM: "border-l-amber-500",
  HIGH: "border-l-primary",
  CRITICAL: "border-l-destructive",
};

export default function CrisisSimulator() {
  const [difficulty, setDifficulty] = useState<string>("Advanced");
  const [simulationData, setSimulationData] = useState<any>(null);
  const [crisisId, setCrisisId] = useState<string | null>(null);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [directive, setDirective] = useState("");
  const [fetchingResults, setFetchingResults] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { conference } = UseConference();
  const { user } = UseUser();

  const loadingMessages = [
    "Compiling Satellite Imagery...",
    "Decrypting Geopolitical Comms...",
    "Mapping Threat Actor Interests...",
    "Generating Strategic Scenarios...",
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (eventsLoading) {
      interval = setInterval(() => {
        setLoadingStep((s) => (s + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [eventsLoading]);

  const fetchUsage = () => {
    if (!user?.id) return;
    axios.get(`/api/user/usage/${user.id}`).then((res) => {
      setUsage(res.data.usage);
    }).catch(() => {});
  };

  useEffect(() => {
    if (!conference) return;
    const active = sessionStorage.getItem("active_crisis");
    if (active) {
      try {
        const parsed = JSON.parse(active);
        if (parsed.scenario_title) {
          setSimulationData(parsed);
          setCrisisId(parsed.crisisId ?? null);
        } else {
          sessionStorage.removeItem("active_crisis");
        }
      } catch {
        sessionStorage.removeItem("active_crisis");
      }
    }
    fetchUsage();
  }, [user, conference]);

  const startSimulation = () => {
    if (!conference?.id) {
      setError("Please select a conference first in the header.");
      return;
    }
    setError(null);
    setEventsLoading(true);
    setResults(null);
    setSimulationData(null);
    setCrisisId(null);

    axios
      .get(`/api/crisis/${conference.id}?difficulty=${difficulty}`)
      .then((res) => {
        const data = res.data;
        if (!data.scenario_title) {
          throw new Error("Invalid simulation data received.");
        }
        setSimulationData(data);
        setCrisisId(data.crisisId ?? null);
        sessionStorage.setItem("active_crisis", JSON.stringify(data));
      })
      .catch((err) => {
        console.error("[startSimulation] error:", err);
        if (err.response?.status === 403) {
          setLimitReached(true);
        } else {
          let errorMsg = "Unknown error. Make sure your conference has a country and topic set.";
          if (err.response?.data) {
             errorMsg = typeof err.response.data === 'string' 
                ? err.response.data 
                : JSON.stringify(err.response.data);
          } else if (err.message) {
             errorMsg = err.message;
          }
          setError(errorMsg);
        }
      })
      .finally(() => setEventsLoading(false));
  };

  const handleSubmit = () => {
    if (!directive.trim()) return;
    setError(null);
    setFetchingResults(true);

    axios
      .post(`/api/crisis/${conference?.id}`, {
        crisis: simulationData,
        response: directive,
        crisisId: crisisId,
      })
      .then((res) => {
        // API returns { feedback: { ... } }
        const feedback = res.data?.feedback ?? res.data;
        setResults(feedback);
        sessionStorage.removeItem("active_crisis");
      })
      .catch((err) => {
        console.error("[handleSubmit] error:", err);
        setError("Evaluation failed. Please check your connection and try again.");
      })
      .finally(() => {
        setFetchingResults(false);
        fetchUsage();
      });
  };

  const resetSimulation = () => {
    setSimulationData(null);
    setCrisisId(null);
    setResults(null);
    setDirective("");
    setError(null);
    sessionStorage.removeItem("active_crisis");
  };

  // ─── LIMIT REACHED ─────────────────────────────────────────────────────────
  if (limitReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Daily Limit Reached</h2>
        <p className="text-muted-foreground max-w-sm">
          You&apos;ve used all your crisis simulation slots for today. Upgrade to Pro for unlimited access.
        </p>
      </div>
    );
  }

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
            <h1 className="text-5xl font-playfair font-bold tracking-tight">The Situation Room</h1>
            <p className="text-muted-foreground text-xl">
              Initialize a high-fidelity crisis simulation based on your conference dossier.
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
            {(["Beginner", "Advanced", "Chaos"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                  difficulty === level
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                {level === "Beginner" && <Shield className="w-8 h-8" />}
                {level === "Advanced" && <Zap className="w-8 h-8" />}
                {level === "Chaos" && <Skull className="w-8 h-8" />}
                <span className="font-bold text-lg">{level}</span>
                <span className="text-xs opacity-60">
                  {level === "Beginner" && "Stable & Educational"}
                  {level === "Advanced" && "Dynamic & Tactical"}
                  {level === "Chaos" && "Extreme Volatility"}
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={startSimulation}
            className="w-full py-8 rounded-3xl text-xl font-bold bg-primary hover:bg-primary/90 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
          >
            Start Simulation <ChevronRight className="w-6 h-6" />
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
          <Radio className="w-12 h-12 text-primary" />
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
              transition={{ duration: 6, ease: "linear" }}
            />
          </div>
          <p className="text-sm text-muted-foreground">Establishing secure intelligence link...</p>
        </div>
      </div>
    );
  }

  // ─── SIMULATION ACTIVE ─────────────────────────────────────────────────────
  const allEvents = simulationData
    ? [simulationData.initial_event, ...(simulationData.updates ?? [])]
    : [];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/50 p-6 rounded-3xl border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-playfair font-bold">{simulationData.scenario_title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-wider">
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">Level: {difficulty}</span>
              <span>•</span>
              <span>{simulationData.global_context}</span>
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={resetSimulation} className="rounded-full">
          End Mission
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
            {allEvents.map((evt: any, i: number) => (
              <motion.div
                key={i}
                variants={item}
                className={`p-6 rounded-3xl border-l-4 bg-card shadow-sm ${
                  SEVERITY_BORDER[evt.severity] ?? "border-l-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                        SEVERITY_STYLES[evt.severity] ?? ""
                      }`}
                    >
                      {evt.severity}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {evt.region}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <Radio className="w-3 h-3" /> T+{i * 15}M
                  </span>
                </div>
                <p className="text-foreground leading-relaxed text-sm font-medium">{evt.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Response input — hide after results are shown */}
          {!results && (
            <div className="bg-card rounded-3xl border border-border/50 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <TerminalIcon className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Response Protocol</h3>
              </div>
              <textarea
                value={directive}
                onChange={(e) => setDirective(e.target.value)}
                placeholder="Draft and execute a comprehensive directive response..."
                className="min-h-[200px] bg-background/50 border border-border/30 rounded-2xl p-6 font-mono text-sm resize-none focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground italic">
                  Submit a response addressing all active developments.
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!directive.trim() || fetchingResults}
                  className="px-8 rounded-full"
                >
                  {fetchingResults ? "Analyzing Strategy..." : "Execute Directive"}
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
                Directive received. After-Action Report compiled below.
              </div>

              {/* Operational Outcomes */}
              <div className="rounded-3xl border border-border bg-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Operational Outcomes
                </h3>
                <div className="grid gap-4">
                  {(results.event_outcomes ?? []).map((outcome: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-4"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          outcome.status === "Resolved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {outcome.status === "Resolved" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                          {outcome.event_id === 0 ? "Initial Event" : `Update ${outcome.event_id}`}
                        </span>
                        <p className="text-sm font-bold">{outcome.status}</p>
                        <p className="text-xs text-muted-foreground">{outcome.impact_note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths / Weaknesses / Tip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl border border-green-500/20 bg-green-500/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-4">
                    Strategic Strengths
                  </h4>
                  <ul className="text-xs space-y-2">
                    {(results.feedback?.strengths ?? []).map((s: string, i: number) => (
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
                    {(results.feedback?.weaknesses ?? []).map((w: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-600 mb-4">
                    Director&apos;s Strategic Tip
                  </h4>
                  <p className="text-xs leading-relaxed">{results.feedback?.strategic_tip}</p>
                </div>
              </div>

              <Button variant="outline" onClick={resetSimulation} className="w-full rounded-full">
                Start New Simulation
              </Button>
            </motion.div>
          )}
        </div>

        {/* Right: Strategic Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl border border-border/50 bg-card p-6 space-y-6">
            <h3 className="font-bold border-b border-border/50 pb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Strategic Dashboard
            </h3>

            <div className="space-y-4">
              {/* Threat Actors */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground">Threat Actors</span>
                <div className="flex flex-wrap gap-2">
                  {(simulationData.threat_actors ?? []).map((tag: string) => (
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
                  Intelligence Focus
                </span>
                <p className="text-xs font-medium text-foreground pt-1">
                  {(simulationData.intelligence?.weakPoints?.length ?? 0) > 0
                    ? simulationData.intelligence.weakPoints.join(", ")
                    : "General Crisis Response"}
                </p>
              </div>

              {/* Risk Level */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground">Risk Level</span>
                  <p className="text-lg font-bold text-foreground">
                    {difficulty === "Chaos" ? "CRITICAL" : difficulty === "Advanced" ? "HIGH" : "MEDIUM"}
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
                <h3 className="font-bold">Final Verdict</h3>
                <span className="text-4xl font-black text-primary">{results.overall_grade}</span>
              </div>
              <div className="p-4 rounded-2xl bg-background/50 border border-primary/10 italic text-sm text-foreground/90 leading-relaxed">
                &ldquo;{results.in_character_briefing}&rdquo;
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Master Verdict</span>
                <span className="font-bold text-foreground">{results.master_verdict}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                <span>Total Score</span>
                <span className="font-bold text-foreground">{results.total_score} / 100</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
