"use client";

import { useState } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Shield, Swords, Plus, Trash2, Sparkles, Users, Mic, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withSubscriptionGate } from "@/components/subscription-gate";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

type DelegateTag = "Ally" | "Adversary" | "Neutral";
interface DelegateEntry { id: number; country: string; tag: DelegateTag; note: string; }
interface SpeakerEntry { id: number; country: string; position: string; }

const TAG_STYLES: Record<DelegateTag, string> = {
  Ally: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Adversary: "bg-primary/10 text-primary border-primary/20",
  Neutral: "bg-secondary text-muted-foreground border-border",
};

const RebuttalButton = withSubscriptionGate(({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} variant="outline" className="rounded-full border-primary/30 text-primary hover:bg-primary/10 font-medium">
    <Sparkles className="w-4 h-4 mr-2" />
    Generate Rebuttal
  </Button>
),
  "debates",
  "debates"
);

export default function DebateArena() {
  const [activeTab, setActiveTab] = useState<"tracker" | "gsl">("tracker");
  const [delegates, setDelegates] = useState<DelegateEntry[]>([
    { id: 1, country: "United States", tag: "Ally", note: "Supports resolution framework on cyber norms" },
    { id: 2, country: "Russian Federation", tag: "Adversary", note: "Opposing sanctions clause; likely to amend OP3" },
    { id: 3, country: "Germany", tag: "Neutral", note: "Undecided on verification mechanism" },
  ]);
  const [speakers, setSpeakers] = useState<SpeakerEntry[]>([
    { id: 1, country: "United Kingdom", position: "Strongly in favor of binding resolution" },
    { id: 2, country: "China", position: "Prefers non-binding framework with national sovereignty clause" },
  ]);
  const [newCountry, setNewCountry] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newTag, setNewTag] = useState<DelegateTag>("Neutral");
  const [rebuttalText, setRebuttalText] = useState("");

  const addDelegate = () => {
    if (!newCountry.trim()) return;
    setDelegates((prev) => [...prev, { id: Date.now(), country: newCountry, tag: newTag, note: newNote }]);
    setNewCountry("");
    setNewNote("");
    setNewTag("Neutral");
  };

  const removeDelegate = (id: number) => setDelegates((prev) => prev.filter((d) => d.id !== id));

  const handleRebuttal = () => {
    setRebuttalText(
      "🎯 Suggested Counter: Raise a Point of Information after China's statement citing UNGA Resolution 73/27 on responsible state behaviour in cyberspace — pivot to multilateral verification frameworks as a middle ground that preserves sovereignty while ensuring accountability."
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight text-foreground">Debate Arena</h2>
          <p className="text-muted-foreground text-lg">Strategic War Room for real-time caucus management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-geist font-semibold border border-primary/20">
            Free: 1 active simulation
          </div>
          <RebuttalButton onClick={handleRebuttal} />
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex bg-muted/30 p-1 rounded-full w-fit">
        <button
          onClick={() => setActiveTab("tracker")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "tracker" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Users className="w-4 h-4" /> Position Tracker
        </button>
        <button
          onClick={() => setActiveTab("gsl")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "gsl" ? "bg-background shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Mic className="w-4 h-4" /> GSL Strategist
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "tracker" && (
          <motion.div key="tracker" variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delegate List */}
            <motion.div variants={item} className="lg:col-span-2 rounded-3xl border border-primary/10 bg-card p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-geist font-semibold text-xl">Country Position Map</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" /> {delegates.filter(d => d.tag === "Ally").length} Allies</span>
                  <span className="flex items-center gap-1 ml-3"><Swords className="w-3 h-3 text-primary" /> {delegates.filter(d => d.tag === "Adversary").length} Adversaries</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
                <AnimatePresence>
                  {delegates.map((d) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-4 group"
                    >
                      <div className={`px-3 py-1 rounded-full border text-xs font-semibold shrink-0 mt-0.5 ${TAG_STYLES[d.tag]}`}>{d.tag}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{d.country}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">{d.note}</p>
                      </div>
                      <button onClick={() => removeDelegate(d.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Delegate Form */}
              <div className="border-t border-border/50 pt-6 flex flex-col gap-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Log New Position</h4>
                <div className="flex gap-3 flex-wrap">
                  <input
                    className="flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Country name..."
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                  <select
                    className="px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground text-sm focus:outline-none cursor-pointer"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value as DelegateTag)}
                  >
                    <option value="Neutral">Neutral</option>
                    <option value="Ally">Ally</option>
                    <option value="Adversary">Adversary</option>
                  </select>
                </div>
                <input
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Note their position or key argument..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={addDelegate} className="rounded-full w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Country
                </Button>
              </div>
            </motion.div>

            {/* Rebuttal Engine */}
            <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-geist font-semibold text-xl">Rebuttal Engine</h3>
                  <p className="text-xs text-muted-foreground">AI-driven counter-argument generator</p>
                </div>
              </div>

              {rebuttalText ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 bg-primary/5 border border-primary/20 rounded-2xl p-5">
                  <p className="text-sm text-foreground/90 leading-relaxed">{rebuttalText}</p>
                </motion.div>
              ) : (
                <div className="flex-1 bg-muted/20 border border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3">
                  <Swords className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Click "Generate Rebuttal" to get AI-powered counter-arguments based on the positions in your tracker.</p>
                  <p className="text-xs text-muted-foreground/60">Pro feature — upgrade to unlock unlimited rebuttals</p>
                </div>
              )}

              <RebuttalButton onClick={handleRebuttal} />
            </motion.div>
          </motion.div>
        )}

        {activeTab === "gsl" && (
          <motion.div key="gsl" variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card p-8 flex flex-col gap-6">
              <h3 className="font-geist font-semibold text-xl">General Speakers List</h3>
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
                {speakers.map((s, i) => (
                  <div key={s.id} className="p-4 rounded-2xl border border-border bg-muted/20 flex items-start gap-4">
                    <span className="font-playfair text-2xl font-bold text-primary/40 shrink-0 leading-none mt-0.5">{i + 1}</span>
                    <div>
                      <p className="font-medium text-foreground">{s.country}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.position}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 pt-4 flex flex-col gap-3">
                <input
                  className="w-full px-4 py-2.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Add country to GSL..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      setSpeakers((prev) => [...prev, { id: Date.now(), country: e.currentTarget.value, position: "Position TBC" }]);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Press Enter to add a speaker to the list</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="rounded-3xl border border-primary/10 bg-card p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-geist font-semibold text-xl">Debate Log & Notes</h3>
              </div>
              <textarea
                className="flex-1 min-h-[300px] bg-background/50 rounded-2xl border border-border p-5 text-foreground placeholder:text-muted-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-geist"
                placeholder="Log key points made during debate here...&#10;&#10;Track which arguments landed, which motions were made, and what counter-arguments to prepare..."
                defaultValue="[14:32] Russia challenges OP3 verification mechanism — argue that IAEA precedent supports international oversight&#10;[14:35] China proposes friendly amendment removing binding language — consider co-sponsoring if OP5 is preserved"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
