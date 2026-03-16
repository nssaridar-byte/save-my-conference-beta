import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MissionType = 'research' | 'speech' | 'quiz' | 'drill' | 'gap';

export interface Mission {
  id: string;
  conferenceId: string; // Linked to a specific conference
  title: string;
  description: string;
  type: MissionType;
  completed: boolean;
  targetUrl: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface RoadmapState {
  missions: Mission[];
  streak: number;
  lastUpdated: string;
  missingSections: Record<string, string[]>; // Map conferenceId to sections
  
  // Actions
  addMission: (conferenceId: string, mission: Omit<Mission, 'id' | 'createdAt' | 'completed' | 'conferenceId'>) => void;
  completeMission: (id: string) => void;
  setMissingSections: (conferenceId: string, sections: string[]) => void;
  syncMissions: (conferenceId: string, daysRemaining: number, hasResearch: boolean) => void;
  resetMissions: (conferenceId: string) => void;
}

const generateMissionsForPhase = (
  daysRemaining: number, 
  hasResearch: boolean
): Omit<Mission, 'id' | 'createdAt' | 'completed' | 'conferenceId'>[] => {
  const missions: Omit<Mission, 'id' | 'createdAt' | 'completed' | 'conferenceId'>[] = [];

  // 1. Foundational Feature: Research Upload
  if (!hasResearch) {
    missions.push({
      title: 'Initialize Research Dossier',
      description: 'Upload your background research to the Dual Library for AI analysis.',
      type: 'research',
      targetUrl: '/dual-library',
      priority: 'high'
    });
    // If no research, we can't do much else in Phase 1
    if (daysRemaining > 14) return missions;
  }

  // 2. Phased Feature Highlights
  
  // Phase 1 & 2: Content Creation (T-30 to T-10)
  if (daysRemaining > 10) {
    missions.push({
      title: 'Master Your Opening Speech',
      description: 'Use the Speech Lab to draft a powerful hook and policy statement.',
      type: 'speech',
      targetUrl: '/speech-lab',
      priority: daysRemaining < 21 ? 'high' : 'medium'
    });
  }

  // Phase 3: Tactical Skill-Building (T-10 to T-3)
  if (daysRemaining <= 10 && daysRemaining > 3) {
    missions.push({
      title: 'Rules of Procedure Sprint',
      description: 'Test your knowledge of points and motions in the Quiz Arena.',
      type: 'quiz',
      targetUrl: '/quiz-arena',
      priority: 'high'
    });
    missions.push({
      title: 'Adversarial Debate Practice',
      description: 'Face off against AI in the Debate Arena to sharpen your rebuttals.',
      type: 'drill',
      targetUrl: '/debate-arena',
      priority: 'medium'
    });
  }

  // Phase 4: Battle Readiness (T-3 to T-1)
  if (daysRemaining <= 3 && daysRemaining >= 1) {
    missions.push({
      title: 'High-Pressure Crisis Drill',
      description: 'Simulate unexpected committee updates in the Crisis Simulator.',
      type: 'drill',
      targetUrl: '/crisis-simulator',
      priority: 'high'
    });
    missions.push({
      title: 'Final Policy Polish',
      description: 'Review your dossiers in the Dual Library for last-minute prep.',
      type: 'research',
      targetUrl: '/dual-library',
      priority: 'medium'
    });
  }

  return missions;
};

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      missions: [],
      streak: 0,
      lastUpdated: new Date().toISOString(),
      missingSections: {},

      addMission: (conferenceId, mission) => set((state) => ({
        missions: [
          ...state.missions,
          {
            ...mission,
            conferenceId,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false
          }
        ]
      })),

      completeMission: (id) => set((state) => {
        const missions = state.missions.map(m => 
          m.id === id ? { ...m, completed: true } : m
        );
        
        // Streak logic
        const today = new Date().toISOString().split('T')[0];
        const lastUpdate = (state.lastUpdated || "").split('T')[0];
        let streak = state.streak || 0;
        
        if (lastUpdate !== today) {
          streak += 1;
        }

        return { missions, streak, lastUpdated: new Date().toISOString() };
      }),

      setMissingSections: (conferenceId, sections) => set((state) => {
        // Generate gap missions
        const gapMissions: Mission[] = sections.map(section => ({
          id: crypto.randomUUID(),
          conferenceId,
          title: `Research Gap: ${section}`,
          description: `AI detected missing ${section} data. Add this to your dossier in the Dual Library.`,
          type: 'gap',
          completed: false,
          targetUrl: '/dual-library',
          priority: 'high',
          createdAt: new Date().toISOString()
        }));

        // Filter out existing gap missions FOR THIS CONFERENCE
        const otherMissions = state.missions.filter(m => !(m.conferenceId === conferenceId && m.type === 'gap'));
        
        return { 
          missingSections: {
            ...state.missingSections,
            [conferenceId]: sections
          },
          missions: [...otherMissions, ...gapMissions]
        };
      }),

      syncMissions: (conferenceId, daysRemaining, hasResearch) => {
        const state = get();
        const baseMissions = generateMissionsForPhase(daysRemaining, hasResearch);
        
        // Only add if not already present for this conference by title
        const currentTitles = new Set(
          state.missions
            .filter(m => m.conferenceId === conferenceId)
            .map(m => m.title)
        );
        
        const newMissions = baseMissions
          .filter(bm => !currentTitles.has(bm.title))
          .map(bm => ({
            ...bm,
            conferenceId,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false
          }));

        if (newMissions.length > 0) {
          set({ missions: [...state.missions, ...newMissions] });
        }
      },

      resetMissions: (conferenceId) => set((state) => ({ 
        missions: state.missions.filter(m => m.conferenceId !== conferenceId),
        missingSections: {
          ...state.missingSections,
          [conferenceId]: []
        }
      }))
    }),
    {
      name: 'smc-roadmap-v2',
    }
  )
);
