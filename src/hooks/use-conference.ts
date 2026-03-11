/**
 * Conference store — supports multiple conferences with an active selection.
 *
 * BACKEND INTEGRATION GUIDE:
 * --------------------------------------------------
 *   LIST:   GET    /api/conferences           → setConferencesFromApi(list)
 *   CREATE: POST   /api/conferences           → body: Omit<Conference, "id"|"createdAt">
 *   UPDATE: PUT    /api/conferences/:id
 *   DELETE: DELETE /api/conferences/:id
 *   ACTIVE: PATCH  /api/conferences/:id/activate
 *
 * On app boot (or after login), call fetchFromApi which hits GET /api/conferences
 * and calls setConferencesFromApi + setActiveId with the returned data.
 * --------------------------------------------------
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Conference {
  id: string;
  name: string;
  date: string; // ISO date  "YYYY-MM-DD"
  location: string;
  committee: string;
  country: string; // Country being represented
  topic: string;
  createdAt: string; // ISO timestamp
}

export interface ConferenceStore {
  /** All conferences for this user */
  conferences: Conference[];

  /** ID of the currently active / selected conference (null = none) */
  activeId: string | null;

  // ── Derived helper (not persisted) ──
  /** Returns the currently active Conference object, or null */
  getActive: () => Conference | null;

  // ── Actions ──
  addConference: (data: Omit<Conference, "id" | "createdAt">) => void;
  updateConference: (
    id: string,
    data: Partial<Omit<Conference, "id" | "createdAt">>,
  ) => void;
  deleteConference: (id: string) => void;
  setActiveId: (id: string | null) => void;

  // ── Backend-ready hooks ──
  /** Replace local list with data from GET /api/conferences */
  setConferencesFromApi: (
    conferences: Conference[],
    activeId?: string | null,
  ) => void;
}

export const useConferenceStore = create<ConferenceStore>()(
  persist(
    (set, get) => ({
      conferences: [],
      activeId: null,

      getActive: () => {
        const { conferences, activeId } = get();
        return conferences.find((c) => c.id === activeId) ?? null;
      },

      addConference: (data) => {
        const newConference: Conference = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          conferences: [...state.conferences, newConference],
          // Auto-select if it's the first one
          activeId: state.activeId ?? newConference.id,
        }));
      },

      updateConference: (id, data) =>
        set((state) => ({
          conferences: state.conferences.map((c) =>
            c.id === id ? { ...c, ...data } : c,
          ),
        })),

      deleteConference: (id) =>
        set((state) => {
          const remaining = state.conferences.filter((c) => c.id !== id);
          // If the deleted one was active, auto-select the first remaining
          const newActiveId =
            state.activeId === id ? (remaining[0]?.id ?? null) : state.activeId;
          return { conferences: remaining, activeId: newActiveId };
        }),

      setActiveId: (id) => set({ activeId: id }),

      setConferencesFromApi: (conferences, activeId) =>
        set({ conferences, activeId: activeId ?? conferences[0]?.id ?? null }),
    }),
    {
      name: "smc-conferences",
    },
  ),
);
