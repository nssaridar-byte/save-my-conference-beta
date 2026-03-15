"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe2, ChevronRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { UseConference } from "../../../contexts/ConferenceContext";

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

const EVENTS = [
  {
    severity: "HIGH",
    text: "Satellite telemetry indicates unexpected military movement near the 38th parallel.",
    region: "East Asia",
  },
  {
    severity: "MEDIUM",
    text: "European markets plunge 4% amidst reports of imminent trade embargo.",
    region: "Europe",
  },
  {
    severity: "CRITICAL",
    text: "Massive blackout in regional capital city following suspected coordinated cyberattack.",
    region: "Eastern Europe",
  },
];

const DIRECTIVES_LOG = [
  {
    time: "14:32",
    text: "Emergency session requested under Rule 8(a).",
    status: "Submitted",
  },
  {
    time: "14:41",
    text: "Propose deployment of UN monitoring mission to affected region.",
    status: "Under Review",
  },
];

const SEVERITY_STYLES: Record<string, string> = {
  LOW: "bg-muted text-muted-foreground border-border",
  MEDIUM:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  HIGH: "bg-primary/10 text-primary border-primary/20",
  CRITICAL: "bg-destructive/10 text-destructive border-destructive/20",
};
interface TEvent {
  severity: string;
  text: string;
  region: string;
}

export default function CrisisSimulator() {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [directive, setDirective] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const { conference } = UseConference();
  const fetchEvents = () => {
    setEventsLoading(true);
    axios
      .get(`/api/crisis/${conference?.id}`)
      .then((res) => {
        console.log(res.data);

        setEvents(res.data.crisis);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          setLimitReached(true);
        }
      })
      .finally(() => setEventsLoading(false));
  };
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentEvent((p) => (p + 1) % EVENTS.length),
      10000,
    );
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!conference) return;
    fetchEvents();
  }, [conference]);
  const handleSubmit = () => {
    if (!directive.trim()) return;
    const mockScore = Math.floor(Math.random() * 25) + 70;
    setScore(mockScore);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDirective("");
    }, 4000);
  };

  const evt = events[currentEvent];

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div>
        <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">
          Crisis Simulator
        </h2>
        <p className="text-muted-foreground text-lg">
          Respond to real-time events and submit directives.
        </p>
      </div>

      {/* Live Ticker */}
      <AnimatePresence mode="wait">
        {limitReached && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="w-full bg-amber-900/10 border border-amber-700/20 dark:bg-primary/5 dark:border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-5"
          >
            <h1>Limit Reached</h1>
          </motion.div>
        )}
        {events.length > 0 ? (
          <motion.div
            key={currentEvent}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="w-full bg-amber-900/10 border border-amber-700/20 dark:bg-primary/5 dark:border-primary/20 px-6 py-4 rounded-2xl flex items-center gap-5"
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${SEVERITY_STYLES[evt.severity]}`}
              >
                {evt.severity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium text-xs whitespace-normal wrap-break-word">
                {evt.text}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Globe2 className="w-3 h-3" /> {evt.region}
              </p>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">
              {currentEvent + 1}/{events.length}
            </div>
          </motion.div>
        ) : eventsLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full bg-muted/20 border border-border/50 px-6 py-4 rounded-2xl flex items-center gap-5 animate-pulse"
          >
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded-md w-3/4" />
              <div className="h-3 bg-muted rounded-md w-1/4" />
            </div>
            <div className="h-4 w-10 bg-muted rounded-md shrink-0" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Command Terminal - spans 2 */}
        <motion.div
          variants={item}
          className="md:col-span-2 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col gap-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-geist font-semibold text-xl text-foreground">
                Command Terminal
              </h3>
              <p className="text-xs text-muted-foreground">
                Draft a formal directive response to the active situation
              </p>
            </div>
          </div>

          <textarea
            className="flex-1 min-h-[180px] w-full bg-background/50 border border-border/50 rounded-2xl p-5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
            placeholder={
              "> Enter directive here. Be precise.\n> E.g. The delegation of France requests an emergency session under Article 99 to address the imminent threat..."
            }
            value={directive}
            onChange={(e) => setDirective(e.target.value)}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {[
                "Recall Ambassador",
                "Call for Vote",
                "Propose Ceasefire",
                "Request Investigation",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setDirective(t + ": ")}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!directive.trim() || submitted}
              className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              Execute Directive <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Submitted feedback */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-sm text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-3"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Directive submitted and logged. Impact score:{" "}
                <strong>{score}</strong>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Log */}
          {DIRECTIVES_LOG.length > 0 && (
            <div className="border-t border-border/50 pt-4 flex flex-col gap-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Directive Log
              </p>
              {DIRECTIVES_LOG.map((d, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">
                    {d.time}
                  </span>
                  <span className="text-foreground/80 flex-1 whitespace-normal wrap-break-word">
                    {d.text}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium shrink-0">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Global Impact Score */}
        <motion.div
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col items-center justify-center text-center gap-5"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Global Impact Score
            </p>
            <AnimatePresence mode="wait">
              {score ? (
                <motion.p
                  key={score}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-7xl font-playfair font-black text-primary mt-2"
                >
                  {score}
                </motion.p>
              ) : (
                <motion.p
                  key="dash"
                  className="text-7xl font-playfair font-black text-muted-foreground/30 mt-2"
                >
                  —
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p className="text-sm text-muted-foreground max-w-[160px] leading-relaxed">
            {score
              ? "Directive impact assessed by the Dias."
              : "Awaiting directive submission and evaluation."}
          </p>
          {score && (
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
