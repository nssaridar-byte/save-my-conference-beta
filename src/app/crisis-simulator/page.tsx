"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe2, ChevronRight, CheckCircle2 } from "lucide-react";
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
  const [score, setScore] = useState<string | null>(null);
  const [events, setEvents] = useState<TEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [fetchingResults, setFetchingResults] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const { conference } = UseConference();
  const { user } = UseUser();

  const fetchUsage = () => {
    if (!user?.id) return;
    axios.get(`/api/user/usage/${user.id}`).then((res) => {
      setUsage(res.data.usage);
    });
  };

  const fetchEvents = () => {
    setEventsLoading(true);
    const crisis = sessionStorage.getItem("crisis");
    if (crisis) return;
    axios
      .get(`/api/crisis/${conference?.id}`)
      .then((res) => {
        console.log(res.data);
        setEvents(res.data.crisis);
        sessionStorage.setItem("crisis", JSON.stringify(res.data.crisis));
      })
      .catch((err) => {
        if (err.response.status == 403) {
          setLimitReached(true);
        }
      })
      .finally(() => setEventsLoading(false));
  };
  useEffect(() => {
    if (!conference) return;
    const crisis = sessionStorage.getItem("crisis");
    if (crisis) {
      setEvents(JSON.parse(crisis));
    }
    fetchUsage();
  }, [user]);
  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(
      () => setCurrentEvent((p) => (isNaN(p) ? 0 : (p + 1) % events.length)),
      10000,
    );
    return () => clearInterval(timer);
  }, [events.length]);
  useEffect(() => {
    if (
      events.length > 0 &&
      (isNaN(currentEvent) || currentEvent >= events.length)
    ) {
      setCurrentEvent(0);
    }
  }, [events, currentEvent]);

  useEffect(() => {
    if (!conference) return;
    fetchEvents();
  }, [conference]);
  const handleSubmit = () => {
    if (!directive.trim()) return;
    setFetchingResults(true);
    axios
      .post(`/api/crisis/${conference?.id}`, {
        crisis: events,
        response: directive,
      })
      .then((res) => {
        setResults(res.data.feedback);
        setScore(res.data.feedback.overall_grade);
        setSubmitted(true);
      })
      .catch((err) => {
        alert("There was an error");
      })
      .finally(() => {
        setFetchingResults(false);
        fetchEvents();
        sessionStorage.removeItem("crisis");
      });
  };

  const evt = events && events.length > 0 ? events[currentEvent] : null;

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

      {user?.role === "FREE" && (
        <div className="w-fit px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-geist font-semibold border border-primary/20">
          {usage
            ? `${Math.max(0, 1 - usage.crisisCount)} trials left today`
            : "1 trial/day"}
        </div>
      )}

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
        {events.length > 0 && evt ? (
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
              disabled={!directive.trim() || submitted || events.length == 0}
              className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              {fetchingResults == true
                ? "Consulting Chairs..."
                : "Execute Directive"}{" "}
              <ChevronRight
                className={`w-4 h-4 ml-1 ${fetchingResults ? "animate-pulse" : ""}`}
              />
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
        </motion.div>

        {/* Strategic Analysis & Outcomes */}
        <motion.div
          variants={item}
          className="md:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {results && (
            <>
              {/* Event Outcomes */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl border border-border bg-card p-8">
                  <h3 className="text-xl font-playfair font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Operational Outcomes
                  </h3>
                  <div className="grid gap-4">
                    {results.event_outcomes &&
                      results.event_outcomes.map((outcome: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 items-center justify-center "
                        >
                          <div className="shrink-0 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            Crisis {outcome.event_id}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {outcome.status}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {outcome.impact_note}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Strategic Strengths
                    </h4>
                    <ul className="space-y-3">
                      {results.feedback?.strengths?.map(
                        (s: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-foreground flex gap-2"
                          >
                            <span className="text-green-500">•</span> {s}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-destructive mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-3">
                      {results.feedback?.weaknesses?.map(
                        (w: string, i: number) => (
                          <li
                            key={i}
                            className="text-sm text-foreground flex gap-2"
                          >
                            <span className="text-destructive">•</span> {w}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Situation Briefing */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-playfair font-bold">
                      Official Briefing
                    </h3>
                    <div className="text-3xl font-black text-primary font-playfair">
                      {score}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-foreground/90 font-medium bg-background/50 p-4 rounded-2xl border border-primary/10 mb-6 italic">
                      "{results.in_character_briefing}"
                    </p>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                        Director's Strategic Tip
                      </h5>
                      <p className="text-xs text-foreground leading-relaxed">
                        {results.feedback?.strategic_tip}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setResults(null);
                      setSubmitted(false);
                      setScore(null);
                      setDirective("");
                    }}
                    className="mt-8 rounded-full border-primary/20 hover:bg-primary/5"
                  >
                    Reset Simulation
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
