"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Target, 
  Trophy, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileSearch,
  ChevronRight,
  Flame,
  LayoutDashboard,
  RefreshCw,
  ShieldAlert,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRoadmapStore, Mission } from "@/hooks/use-roadmap";
import { useLibraryStore } from "@/hooks/use-library";
import Link from "next/link";
import axios from "axios";
import { UseConference } from "../../contexts/ConferenceContext";

/* ── Gauges ── */
function ReadinessGauge({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          className="stroke-muted/20 fill-none stroke-[8]"
        />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeDasharray={circumference}
          className="stroke-primary fill-none stroke-[10] stroke-round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-playfair font-bold text-foreground">{score}%</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ready</span>
      </div>
    </div>
  );
}

export function RoadmapPanel() {
  const { conference } = UseConference();
  const { 
    missions, 
    completeMission, 
    syncMissions, 
    setMissingSections, 
    streak 
  } = useRoadmapStore();
  
  const { getResearchForConference } = useLibraryStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSyncedDocId, setLastSyncedDocId] = useState<string | null>(null);

  // Sync missions based on date
  useEffect(() => {
    if (conference?.id && conference?.date) {
      const days = Math.ceil((new Date(conference.date).getTime() - Date.now()) / 86_400_000);
      const research = getResearchForConference(conference.id);
      syncMissions(conference.id, days > 0 ? days : 0, !!research);
    }
  }, [conference?.id, conference?.date, syncMissions, getResearchForConference]);

  // Automated AI Gap Analysis from Library
  useEffect(() => {
    if (conference?.id) {
      const research = getResearchForConference(conference.id);
      if (research && research.id !== lastSyncedDocId) {
        setIsAnalyzing(true);
        axios.post("/api/dashboard/analyze-gaps", {
          conferenceId: conference.id,
          content: research.content
        })
        .then(res => {
          setMissingSections(conference.id, res.data.missingSections);
          setLastSyncedDocId(research.id);
        })
        .catch(err => console.error("Auto Gap Analysis failed:", err))
        .finally(() => setIsAnalyzing(false));
      }
    }
  }, [conference?.id, getResearchForConference, setMissingSections, lastSyncedDocId]);

  const handleManualResync = () => {
    if (!conference) return;
    const research = getResearchForConference(conference.id);
    if (research) {
      setIsAnalyzing(true);
      axios.post("/api/dashboard/analyze-gaps", {
        conferenceId: conference.id,
        content: research.content
      })
      .then(res => {
        setMissingSections(conference.id, res.data.missingSections);
        setLastSyncedDocId(research.id);
      })
      .catch(err => alert("Re-Sync failed: " + (err.response?.data || err.message)))
      .finally(() => setIsAnalyzing(false));
    }
  };

  // Filter missions for THIS conference
  const conferenceMissions = missions.filter(m => m.conferenceId === conference?.id);
  
  const completedCount = conferenceMissions.filter(m => m.completed).length;
  const totalCount = conferenceMissions.length;
  const completionScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const daysUntil = conference?.date 
    ? Math.ceil((new Date(conference.date).getTime() - Date.now()) / 86_400_000)
    : 0;

  const activeResearch = conference ? getResearchForConference(conference.id) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Left: Readiness & Countdown ── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-3xl border border-primary/10 bg-card/50 backdrop-blur-md shadow-xl p-8 flex flex-col items-center justify-between text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4">
           {streak > 0 && (
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20"
             >
               <Flame className="w-4 h-4 fill-orange-500" />
               <span className="text-sm font-bold">{streak}d</span>
             </motion.div>
           )}
        </div>

        <div className="flex flex-col items-center gap-6 w-full">
          <div>
            <h3 className="font-geist font-bold text-xl text-foreground">Mission Status</h3>
            <p className="text-sm text-muted-foreground mt-1">T-Minus {daysUntil} Days</p>
          </div>

          <ReadinessGauge score={completionScore} />

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Phase Progress</span>
                <span>{completedCount}/{totalCount} Completed</span>
              </div>
              <Progress value={completionScore} className="h-2 bg-primary/10" />
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Current Directive</p>
              <p className="text-sm text-foreground leading-relaxed italic">
                {daysUntil > 21 ? "Phase 1: Deep Research & Policy Foundation." : 
                 daysUntil > 10 ? "Phase 2: Strategy Drafting & Position Paper mastery." :
                 daysUntil > 3 ? "Phase 3: Tactical Skill-Drills & Speech refinement." :
                 "Phase 4: Battle Readiness, Crisis drills & Final polished rebuttals."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Center/Right: Mission Feed ── */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2 flex flex-col gap-6"
      >
        {/* Mission Feed */}
        <div className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-geist font-bold text-xl flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              Mission Feed
            </h3>
            <span className="px-3 py-1 rounded-full bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Daily Operations</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {conferenceMissions.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-border rounded-3xl">
                  <p className="text-muted-foreground">Searching for assignments...</p>
                </div>
              ) : (
                conferenceMissions.map((mission) => (
                  <motion.div
                    key={mission.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                      mission.completed 
                        ? "bg-muted/30 border-transparent opacity-60" 
                        : "bg-muted/10 border-border hover:border-primary/40 hover:bg-muted/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      mission.completed ? "bg-muted" : "bg-primary/10 text-primary border border-primary/10"
                    }`}>
                      {mission.completed ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold truncate ${mission.completed ? "line-through" : ""}`}>
                          {mission.title}
                        </h4>
                        {!mission.completed && mission.priority === 'high' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase">Critical</span>
                        )}
                        {mission.type === 'gap' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase">Gap</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{mission.description}</p>
                    </div>

                    {!mission.completed && (
                      <div className="flex items-center gap-2 ml-4">
                        <Link href={mission.targetUrl}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-full h-9 hover:bg-primary hover:text-white transition-all shadow-sm"
                            onClick={() => completeMission(mission.id)}
                          >
                            Execute
                          </Button>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Library Analyzer (Automated) */}
        <div className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <FileSearch className="w-24 h-24 text-primary opacity-5 absolute -right-4 -top-4 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full text-center md:text-left">
              <h3 className="font-geist font-bold text-xl mb-4 flex items-center justify-center md:justify-start gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Library Gap Analysis
              </h3>
              
              {activeResearch ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate">{activeResearch.title}</p>
                      <p className="text-xs text-muted-foreground">Source: Dual Library · Research</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 text-xs text-muted-foreground leading-relaxed italic">
                      {isAnalyzing 
                        ? "AI is scanning library dossier for missing MUN pillars..." 
                        : "Synchronized with your library dossier via Gemini AI. Gaps identified have been added as actionable missions."}
                    </div>
                    <Button 
                      onClick={handleManualResync}
                      disabled={isAnalyzing}
                      variant="outline"
                      className="rounded-full h-10 px-6 gap-2 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      AI Re-Sync
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center gap-3 text-center border-2 border-dashed border-border rounded-2xl">
                   <p className="text-sm text-muted-foreground">No research found in the Library for this conference.</p>
                   <Link href="/dual-library">
                     <Button variant="link" className="text-primary text-xs">
                       Go to Dual Library to upload research
                     </Button>
                   </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
