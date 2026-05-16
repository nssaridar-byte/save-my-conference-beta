"use client";
import { TSpeechAnalyze } from "../types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";
import { useUsageStore } from "@/hooks/use-usage";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import {
  Clock,
  Plus,
  Save,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Speech } from "@prisma/client";
import axios from "axios";
import Error from "@/components/Error";
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

const MOCK_ANALYSIS = {
  grade: "B+",
  wpmScore: 148,
  tips: [
    {
      type: "strength" as const,
      text: "Strong opening hook that frames the urgency of the issue effectively.",
    },
    {
      type: "strength" as const,
      text: "Clear use of operative language appropriate for UNSC context.",
    },
    {
      type: "warning" as const,
      text: "Avoid 'I' — use 'The delegation of France...' to maintain formal register.",
    },
    {
      type: "warning" as const,
      text: "Section 2 is dense. Consider splitting into two paragraphs.",
    },
    {
      type: "tip" as const,
      text: "Quote UN Charter Article 39 to strengthen legal authority.",
    },
  ],
};

const TIP_ICONS = {
  strength: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
  tip: <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />,
};

const AnalyzeButton = withSubscriptionGate(
  ({ onClick, isLoading }: { onClick: () => void; isLoading?: boolean }) => (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-0 font-medium disabled:opacity-70"
    >
      <Sparkles className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
      {isLoading ? "Consulting Chair..." : "Analyze Speech"}
    </Button>
  ),
  "speeches",
  "speeches",
);

export default function SpeechLab() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const { incrementUsage, usage } = useUsageStore();
  const [analysis, setAnalysis] = useState<TSpeechAnalyze | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { conference } = UseConference();
  const { user: currentUser } = UseUser();
  const [dbUsage, setDbUsage] = useState<Usage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = () => {
    if (!currentUser?.id) return;
    axios.get(`/api/user/usage/${currentUser.id}`).then((res) => {
      setDbUsage(res.data.usage);
    });
  };

  // Ensure hydration before checking usage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchSpeeches = async () => {
    if (!conference || !conference.id) return;
    axios
      .get(`/api/speech/${conference.id}`)
      .then((res) => {
        setSpeeches(res.data.speeches);
        if (res.data.speeches.length > 0) {
          const first = res.data.speeches[0];
          setSelectedSpeech(first);
          setText(first.content);
          setTitle(first.title);
        } else {
          setSelectedSpeech(null);
          setText("");
          setTitle("");
        }
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to fetch speeches");
      });
  };

  useEffect(() => {
    if (!conference || !currentUser) return;
    fetchSpeeches();
    fetchUsage();
  }, [conference, currentUser]);

  const handleAnalyze = () => {
    if (!selectedSpeech?.id) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    axios
      .post(`/api/speech/analyze/${selectedSpeech.id}`, {})
      .then((res) => {
        console.log(res.data);
        setAnalysis(res.data);
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to analyze speech");
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };

  const handleDeleteSpeech = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this speech?")) return;

    try {
      await axios.delete(`/api/speech/${id}`);
      setSpeeches((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        if (filtered.length === 0) {
          setText("");
          setTitle("");
          setAnalysis(null);
          setSelectedSpeech(null);
        } else if (selectedSpeech?.id === id) {
          const next = filtered[0];
          setSelectedSpeech(next);
          setText(next.content);
          setTitle(next.title);
        }
        return filtered;
      });
    } catch (err: any) {
      setError(err.response?.data || "Failed to delete speech");
    }
  };

  const handleCreateSpeech = () => {
    if (!conference || !conference.id) return;
    axios
      .post(`/api/speech/${conference.id}`, {
        title: "Untitled Speech",
        content: "Draft your speech here...",
        topic: conference.topic || "General",
      })
      .then((res) => {
        const newSpeech = res.data.speech;
        setSpeeches((prev) => [newSpeech, ...prev]);
        setSelectedSpeech(newSpeech);
        setTitle(newSpeech.title);
        setText(newSpeech.content);
        setAnalysis(null);
      })
      .catch((err) => {
        setError(err.response?.data || "Failed to create speech");
      });
  };

  const hasSpeechesDone = isHydrated;


  if (error) {
    return <Error error={error} />;
  }

  if (conference == null) {
    return <Error error={"Please Select A Conference"} />;
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between max-[430px]:flex-col max-[430px]:text-center max-[430px]:gap-2">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">
            Speech Lab
          </h2>
          <p className="text-muted-foreground text-lg">
            Draft, refine, and practice your speeches
          </p>
        </div>
        {currentUser?.role === "FREE" && (
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-geist font-semibold border border-primary/20">
            {dbUsage
              ? `${Math.max(0, 3 - dbUsage.speechesCount)} analyses left today`
              : "3 analyses/day"}
          </div>
        )}
        {hasSpeechesDone && (
          <Button
            onClick={handleCreateSpeech}
            className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90 font-geist"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Speech
          </Button>

        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Sidebar */}
        <motion.div
          variants={item}
          className="lg:col-span-3 min-h-[55vh] rounded-3xl border border-primary/10 bg-card shadow-sm p-6 flex flex-col gap-10"
        >
          <div>
            <h3 className="font-geist font-semibold text-xl text-foreground">
              Your Speeches
            </h3>
            <p className="text-sm text-muted-foreground">
              Saved drafts and revisions
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {speeches.map((speech) => (
              <div
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 group relative ${
                  selectedSpeech?.id === speech.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted/50"
                }`}
                key={speech.id}
                onClick={() => {
                  setSelectedSpeech(speech);
                  setText(speech.content);
                  setTitle(speech.title);
                }}
              >
                <button
                  onClick={(e) => handleDeleteSpeech(speech.id, e)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-destructive/5 hover:bg-destructive/10 text-destructive-foreground/50 hover:text-destructive transition-all"
                  title="Delete Speech"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="font-medium text-foreground truncate text-sm pr-6">
                  {speech.title}
                </span>
                {/* @ts-ignore */}
                {speech.time && (
                  <div className="flex text-xs text-muted-foreground items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {/* @ts-ignore */}
                    {speech.time}s
                  </div>
                )}
              </div>
            ))}
            {speeches.length === 0 && (
              <div className="text-center py-8 px-4 border border-dashed border-border rounded-2xl">
                <FileText className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground italic">
                  No speeches yet. Analyze one to get started!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Editor */}
        <motion.div
          variants={item}
          className="lg:col-span-9 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col gap-6"
        >
          {selectedSpeech ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-border/50 flex-wrap gap-4">
                <div>
                  <h3 className="font-geist font-bold text-xl text-foreground">
                    Editing Speech
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {title || "New Speech"}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* @ts-ignore */}
                  {selectedSpeech.time && (
                    <div className="px-4 py-2 rounded-full bg-secondary/50 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {/* @ts-ignore */}
                      <span className="font-mono">{selectedSpeech.time}s</span>
                    </div>
                  )}
                  <AnalyzeButton
                    onClick={handleAnalyze}
                    isLoading={isAnalyzing}
                  />
                  <Button
                    size="sm"
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                    onClick={() => {
                      axios
                        .put(`/api/speech/${selectedSpeech.id}`, {
                          title,
                          content: text,
                        })
                        .then((res) => {
                          setSelectedSpeech(res.data.speech);
                          setSpeeches((prev) =>
                            prev.map((s) =>
                              s.id === selectedSpeech.id ? res.data.speech : s,
                            ),
                          );
                        })
                        .catch((err) => {
                          alert(err.response?.data || "Failed to save speech");
                        });
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Grade
                            </p>
                            <span className="text-5xl font-playfair font-black text-primary">
                              {analysis.overall_grade}
                            </span>
                          </div>
                          {/* <div className="text-right">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Est. WPM
                            </p>
                            <span className="text-3xl font-playfair font-bold text-foreground">
                              {analysis.wpmScore}
                            </span>
                          </div> */}
                        </div>
                        <div className="rounded-2xl border border-border bg-muted/20 p-5 flex flex-col gap-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            AI Feedback
                          </p>
                          {analysis.feedback.strengths.map((t, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 text-sm text-foreground/80"
                            >
                              {TIP_ICONS["strength"]}
                              <span>{t}</span>
                            </div>
                          ))}
                          {analysis.feedback.weaknesses.map((t, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 text-sm text-foreground/80"
                            >
                              {TIP_ICONS["warning"]}
                              <span>{t}</span>
                            </div>
                          ))}
                          {analysis.feedback.improvement_tips.map((t, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 text-sm text-foreground/80"
                            >
                              {TIP_ICONS["tip"]}
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!analysis && !isAnalyzing && (
                    <div className="flex-1 rounded-2xl border border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
                      <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        Click{" "}
                        <span className="text-primary font-medium">
                          Analyze Speech
                        </span>{" "}
                        to get your grade, WPM estimate, and AI-powered
                        suggestions.
                      </p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex-1 rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[300px]">
                      <div className="relative">
                        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute -inset-3 border-2 border-primary/10 border-t-primary rounded-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-geist font-bold text-lg text-foreground">
                          Chairperson is Deliberating
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-[200px]">
                          Evaluating hook, substance, and policy alignment...
                        </p>
                      </div>
                      <div className="w-full max-w-[180px] h-1.5 bg-primary/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-full h-full bg-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-20">
              <FileText className="w-16 h-16 text-muted-foreground/10" />
              <div>
                <h3 className="text-xl font-geist font-semibold">
                  No Speech Selected
                </h3>
                <p className="text-muted-foreground">
                  Select a speech from the sidebar or create a new one to start
                  editing.
                </p>
              </div>
              <Button
                onClick={handleCreateSpeech}
                className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              >
                <Plus className="w-4 h-4 mr-2" /> Create First Speech
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
