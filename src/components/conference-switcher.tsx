"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Trash2 } from "lucide-react";
import axios from "axios";
import { UseConference } from "../../contexts/ConferenceContext";
import { useConferenceStore, type Conference } from "@/hooks/use-conference";

export function GlobalConferenceSwitcher() {
  const { conference, setConferenceContext, conferences, setConferences } =
    UseConference();
  const [open, setOpen] = useState(false);

  const activeId = conference?.id || "";

  const setActiveConference = (c: Conference) => {
    setConferenceContext(c);
    setOpen(false);
    axios.post(`/api/conferences/active/${c.id}`).catch((err) => {
      console.error("Failed to set active conference:", err);
    });
  };

  const deleteConference = (deletedConference: Conference) => {
    axios.delete(`/api/conferences/${deletedConference.id}`).then(() => {
      const remaining = conferences.filter(
        (c) => c.id !== deletedConference.id,
      );
      setConferences(remaining);
      if (activeId === deletedConference.id) {
        setConferenceContext(remaining[0] || null);
      }
    });
  };
  useEffect(() => {}, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/30 transition-colors text-xs font-semibold max-w-[140px] md:max-w-[200px]"
      >
        <span className="truncate">
          {conference?.title ?? "Select Conference"}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-xl z-[100] overflow-hidden"
          >
            <div className="p-2 flex flex-col gap-0.5 max-h-64 overflow-y-auto">
              {conferences && conferences.length === 0 ? (
                <p className="p-4 text-xs text-center text-muted-foreground">
                  No conferences found
                </p>
              ) : (
                conferences &&
                conferences.map((c: Conference) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 group transition-colors cursor-pointer ${
                      c.id === activeId ? "bg-primary/10" : "hover:bg-muted/40"
                    }`}
                    onClick={() => setActiveConference(c)}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${c.id === activeId ? "text-primary" : "text-foreground"}`}
                      >
                        {c.title}
                      </p>
                    </div>
                    {c.id === activeId && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConference(c);
                      }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
