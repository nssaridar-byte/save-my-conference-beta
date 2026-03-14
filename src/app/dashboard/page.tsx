"use client";

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  FileText,
  Trophy,
  Clock,
  Target,
  ArrowRight,
  Plus,
  Calendar,
  MapPin,
  X,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Conference } from "@/hooks/use-conference";
import axios from "axios";
import { UseConference } from "../../../contexts/ConferenceContext";
import { RoadmapPanel } from "@/components/roadmap-panel";

/* ── Animations ── */
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};
const modal: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.18 } },
};

/* ── Helpers ── */
const daysUntil = (date: string) =>
  date ? Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000) : null;

const fmtDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

/* ═══════════════════════════════════════════════
   Conference Form Modal (create + edit)
═══════════════════════════════════════════════ */
function ConferenceModal({
  initial,
  onClose,
}: {
  initial?: Partial<Conference>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    date: initial?.date ?? "",
    location: initial?.location ?? "",
    committee: initial?.committee ?? "",
    country: initial?.country ?? "",
    topic: initial?.topic ?? "",
  });
  const { setConferenceContext, conferences, setConferences } = UseConference();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.committee || !form.country) return;
    onClose();
    axios
      .post("/api/conferences", {
        title: form.title,
        date: form.date,
        location: form.location,
        committee: form.committee,
        country: form.country,
        topic: form.topic,
      })
      .then(async (res) => {
        setConferences([...conferences, res.data.conference]);
        setConferenceContext(res.data.conference);
      })
      .catch((err) => {
        alert(err.response.data || err.message);
      });
  };
  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    axios
      .put(`/api/conferences/${initial?.id}`, {
        title: form.title,
        date: form.date,
        location: form.location,
        committee: form.committee,
        country: form.country,
        topic: form.topic,
      })
      .then((res) => {
        alert("Edited");
        onClose();
        setConferenceContext(res.data.conference);
        const newConferences = conferences.map((c) =>
          c.id === initial?.id ? res.data.conference : c,
        );
        setConferences(newConferences);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <AnimatePresence>
        <motion.div
          variants={modal}
          initial="hidden"
          animate="show"
          exit="exit"
          className="relative z-10 w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-playfair font-bold text-2xl">
                {initial?.id ? "Edit Conference" : "New Conference"}
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {initial?.id
                  ? "Update your assignment details."
                  : "Set up your upcoming assignment."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={initial?.id ? handleEdit : handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Conference Name<span className="text-primary ml-0.5">*</span>
              </label>
              <Input
                placeholder="e.g. Global MUN Summit 2026"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                className="rounded-2xl border-border h-11"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="rounded-2xl border-border h-11"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g. New York, USA"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  className="rounded-2xl border-border h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Committee<span className="text-primary ml-0.5">*</span>
              </label>
              <Input
                placeholder="e.g. UN Security Council"
                value={form.committee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, committee: e.target.value }))
                }
                className="rounded-2xl border-border h-11"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Country Representing
                <span className="text-primary ml-0.5">*</span>
              </label>
              <Input
                placeholder="e.g. France"
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                className="rounded-2xl border-border h-11"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Topic / Agenda Item</label>
              <Input
                placeholder="e.g. Cybersecurity Threats"
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
                className="rounded-2xl border-border h-11"
              />
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {initial?.id ? "Save Changes" : "Create Conference"}
              </Button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Empty State
═══════════════════════════════════════════════ */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center py-24 gap-8 text-center"
    >
      <motion.div variants={item}>
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-primary/50" />
        </div>
        <h3 className="font-playfair text-3xl font-bold mb-3">
          No conferences yet
        </h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Add your first conference and your Command Center will tailor every
          module — speeches, quizzes, debates — to your specific committee and
          country.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Button
          onClick={onAdd}
          className="rounded-full px-8 py-6 text-base font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Your First Conference
        </Button>
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
      >
        {[
          { icon: Calendar, label: "Set your date & committee" },
          { icon: MapPin, label: "Add your country assignment" },
          { icon: Trophy, label: "Let AI prepare you for it" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-muted-foreground text-sm"
          >
            <Icon className="w-5 h-5 opacity-40" />
            {label}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Active Conference Dashboard
═══════════════════════════════════════════════ */
function ActiveDashboard({
  conference,
  onEdit,
}: {
  conference: Conference;
  onEdit: () => void;
}) {
  const days = daysUntil(conference.date);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min"
    >
      {/* Main card — 2 cols */}
      <motion.div
        variants={item}
        className="md:col-span-2 rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col gap-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-geist font-semibold text-2xl">
                {conference.title}
              </h3>
              <p className="text-primary font-medium mt-0.5">
                Active assignment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase">
                Active
              </span>
              <button
                onClick={onEdit}
                className="px-3 py-1 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:bg-muted/40 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              {
                icon: Clock,
                label: "Date",
                value: fmtDate(conference.date),
                sub: days !== null && days > 0 ? `${days}d away` : undefined,
              },
              {
                icon: Target,
                label: "Location",
                value: conference.location || "—",
              },
              { icon: Trophy, label: "Committee", value: conference.committee },
              {
                icon: Target,
                label: "Representing",
                value: conference.country,
              },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
                <span className="font-semibold text-sm leading-tight">
                  {value || "—"}
                </span>
                {sub && <span className="text-xs text-primary">{sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Progress & Training Roadmap ── */}
      <motion.div variants={item} className="md:col-span-3">
        <RoadmapPanel />
      </motion.div>

      {/* Stat tiles */}
      {/* {[
        { label: "Speech Quality", value: "—", icon: Trophy },
        { label: "Quiz Performance", value: "—", icon: Target },
        {
          label: "Days Until Conference",
          value: days !== null && days > 0 ? `${days}d` : "—",
          icon: Clock,
        },
      ].map(({ label, value, icon: Icon }) => (
        <motion.div
          key={label}
          variants={item}
          className="rounded-3xl border border-primary/10 bg-card shadow-sm p-8 flex flex-col justify-between group hover:border-primary/30 transition-colors"
        >
          <span className="text-sm text-muted-foreground">{label}</span>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-5xl font-playfair font-bold">{value}</span>
            <Icon className="w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors" />
          </div>
        </motion.div>
      ))} */}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Page
═══════════════════════════════════════════════ */
export default function Dashboard() {
  const { conferences, setConferences, conference, setConferenceContext } =
    UseConference();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Conference | null>(null);
  const [activeId, setActiveIdState] = useState<string>("");
  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = () => {
    setEditing(conference);
    setShowModal(true);
  };

  const handleSave = (_data: Omit<Conference, "id" | "createdAt">) => {
    // Conference creation is handled inside ConferenceModal via axios.post.
    // This callback is a no-op post-save hook (e.g. for future analytics/logging).
  };
  const fetchConference = async () => {
    await axios
      .get("/api/conferences/active")
      .then((res) => {
        console.log(res.data);
        setConferenceContext(res.data.conference);
        setActiveIdState(res.data.conference.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchConference();
    // fetchConferences is already called in the Provider's useEffect,
    // but calling it here is fine as well for freshness on dashboard mount.
  }, []);

  const setActiveConference = (conference: Conference) => {
    setActiveIdState(conference.id);
    setConferenceContext(conference);
    axios
      .post(`/api/conferences/active/${conference.id}`, {})
      .then((res) => {})
      .catch((err) => {
        console.log(err);
        setActiveIdState("");
        setConferenceContext(null);
      });
  };
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-playfair font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-lg mt-1">
            {conference
              ? `Preparing for ${conference.committee} · ${conference.country}`
              : "Set up your first conference to get started."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={openCreate}
            variant="outline"
            className="rounded-full gap-2"
          >
            <Plus className="w-4 h-4" /> Add Conference
          </Button>
        </div>
      </div>

      {/* Body */}
      {conferences && conferences.length > 0 && conference !== null ? (
        <ActiveDashboard
          conference={conference as Conference}
          onEdit={openEdit}
        />
      ) : (
        <EmptyState onAdd={openCreate} />
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ConferenceModal
            initial={editing ?? undefined}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
