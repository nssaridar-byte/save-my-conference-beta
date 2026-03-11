"use client";

import { useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Clock, ChevronRight, Trophy, BookOpen, Globe, Landmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";
import { useUsageStore } from "@/hooks/use-usage";

const QUESTIONS = [
  {
    id: 1,
    category: "Parliamentary Procedure",
    question: "A delegate wishes to question the speaker after their speech. What is the correct procedure?",
    options: [
      "Raise a Point of Personal Privilege",
      "Yield the floor to Questions",
      "Motion for a Moderated Caucus",
      "Raise a Point of Order",
    ],
    correct: 1,
    explanation: "A delegate can yield their remaining speaking time 'to Questions', allowing the chair to recognise other delegates to ask questions.",
  },
  {
    id: 2,
    category: "Country Policy",
    question: "France's permanent seat on the UNSC gives it what unique power?",
    options: [
      "The right to introduce emergency resolutions",
      "Veto power over any UNSC resolution",
      "The ability to suspend any member state",
      "Unlimited speaking time in the GSL",
    ],
    correct: 1,
    explanation: "P5 members (USA, UK, France, Russia, China) possess veto power — a single 'No' vote blocks any UNSC resolution.",
  },
  {
    id: 3,
    category: "Historical Context",
    question: "The UN Security Council was established primarily to address what failure of its predecessor?",
    options: [
      "The League of Nations' inability to enforce economic sanctions",
      "The League of Nations' lack of binding resolutions and enforcement mechanisms",
      "The League of Nations' insufficient funding model",
      "The League of Nations' exclusion of colonial territories",
    ],
    correct: 1,
    explanation: "The League of Nations famously lacked enforcement power. The UNSC was designed with binding resolutions and a permanent membership of the world's major powers to remedy this.",
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Parliamentary Procedure": <Landmark className="w-4 h-4" />,
  "Country Policy": <Globe className="w-4 h-4" />,
  "Historical Context": <BookOpen className="w-4 h-4" />,
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const StartButton = withSubscriptionGate(({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} className="rounded-full px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
    <Sparkles className="w-4 h-4 mr-2" />
    Start Quiz
  </Button>
), "quizzes");

type Phase = "lobby" | "question" | "feedback" | "results";

export default function QuizArena() {
  const { incrementUsage } = useUsageStore();
  const [phase, setPhase] = useState<Phase>("lobby");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(30);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSelect(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, currentQ]);

  const handleStart = () => {
    incrementUsage("quizzes");
    setPhase("question");
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === QUESTIONS[currentQ].correct;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, correct]);
    setPhase("feedback");
  };

  const handleNext = () => {
    if (currentQ + 1 >= QUESTIONS.length) {
      setPhase("results");
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setPhase("question");
    }
  };

  const pct = Math.round((score / QUESTIONS.length) * 100);
  const q = QUESTIONS[currentQ];

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Quiz Arena</h2>
          <p className="text-muted-foreground text-lg">High-stakes competency validation for delegates</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-geist font-semibold border border-primary/20">
          Free: 3 quizzes/month
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "lobby" && (
          <motion.div key="lobby" variants={container} initial="hidden" animate="show" exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} className="md:col-span-2 rounded-3xl border border-primary/10 bg-card p-10 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="relative">
                <h3 className="font-playfair text-3xl font-bold mb-3">The Situation Room</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Test your mastery across three critical pillars: <span className="text-primary font-semibold">Parliamentary Procedure</span>, <span className="text-primary font-semibold">Country Policy</span>, and <span className="text-primary font-semibold">Historical Context</span>.
                  Each question has a 30-second Shot Clock. Immediate feedback on every answer.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  {["3 Questions", "30s Per Question", "Instant Feedback", "Competency Map"].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">{tag}</span>
                  ))}
                </div>
                <div className="mt-10">
                  <StartButton onClick={handleStart} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-4">
              {["Parliamentary Procedure", "Country Policy", "Historical Context"].map((cat) => (
                <div key={cat} className="rounded-3xl border border-primary/10 bg-card p-6 flex items-center gap-4 group hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {CATEGORY_ICONS[cat]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{cat}</p>
                    <p className="text-muted-foreground text-xs">1 question</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {(phase === "question" || phase === "feedback") && (
          <motion.div key="question" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            {/* Progress + Shot Clock */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i < currentQ ? "w-8 bg-primary" : i === currentQ ? "w-12 bg-primary" : "w-8 bg-border"}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-2">Question {currentQ + 1} of {QUESTIONS.length}</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg border transition-colors ${timeLeft <= 10 ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-border bg-card text-foreground"}`}>
                <Clock className="w-4 h-4" />
                {timeLeft}s
              </div>
            </div>

            <div className="rounded-3xl border border-primary/10 bg-card p-8 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 flex items-center gap-1.5">
                  {CATEGORY_ICONS[q.category]}
                  {q.category}
                </span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-foreground">{q.question}</h3>

              <div className="grid grid-cols-1 gap-3 mt-2">
                {q.options.map((opt, i) => {
                  let style = "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
                  if (phase === "feedback") {
                    if (i === q.correct) style = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                    else if (i === selected && i !== q.correct) style = "border-destructive bg-destructive/10 text-destructive";
                    else style = "border-border bg-muted/10 opacity-50";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => phase === "question" && handleSelect(i)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 font-geist flex items-center justify-between gap-4 ${style}`}
                    >
                      <span>{opt}</span>
                      {phase === "feedback" && i === q.correct && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                      {phase === "feedback" && i === selected && i !== q.correct && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {phase === "feedback" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="font-semibold text-primary mb-1">📋 Diplomatic Note</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">{q.explanation}</p>
                  <Button onClick={handleNext} className="mt-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {currentQ + 1 >= QUESTIONS.length ? "View Results" : "Next Question"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div key="results" variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item} className="md:col-span-2 rounded-3xl border border-primary/10 bg-card p-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-playfair text-3xl font-bold">Competency Map</h3>
                  <p className="text-muted-foreground">Quiz completed — here are your results</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-muted/20">
                    {answers[i] ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">{q.category}</p>
                      <p className="text-sm font-medium text-foreground">{q.question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="flex flex-col gap-4">
              <div className="rounded-3xl border border-primary/10 bg-card p-8 flex flex-col items-center text-center gap-4">
                <p className="text-sm text-muted-foreground">Overall Score</p>
                <span className="text-7xl font-playfair font-black text-primary">{pct}%</span>
                <p className="text-muted-foreground">{score} of {QUESTIONS.length} correct</p>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-sm font-medium text-primary">
                  {pct >= 80 ? "🏅 Excellent Delegate!" : pct >= 60 ? "📋 Solid Foundation" : "📚 Keep Studying"}
                </p>
              </div>
              <Button
                onClick={() => { setPhase("lobby"); setSelected(null); }}
                className="rounded-full w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Retake Quiz
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
