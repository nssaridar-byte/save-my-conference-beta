import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MissionType = 'research' | 'speech' | 'quiz' | 'drill' | 'gap';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  completed: boolean;
  targetUrl: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface RoadmapState {
  conferenceDate: string | null;
  missions: Mission[];
  streak: number;
  lastUpdated: string;
  missingSections: string[];
  
  // Actions
  setConferenceDate: (date: string) => void;
  addMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'completed'>) => void;
  completeMission: (id: string) => void;
  setMissingSections: (sections: string[]) => void;
  syncMissions: (daysRemaining: number) => void;
  resetMissions: () => void;
}

const generateMissionsForPhase = (daysRemaining: number): Omit<Mission, 'id' | 'createdAt' | 'completed'>[] => {
  const missions: Omit<Mission, 'id' | 'createdAt' | 'completed'>[] = [];

  if (daysRemaining > 14) {
    missions.push({
      title: 'Analyze Topic Background',
      description: 'Review the historical context of your committee topic.',
      type: 'research',
      targetUrl: '/speech-lab', // Assuming research fits here or library
      priority: 'medium'
    });
  } else if (daysRemaining > 7) {
    missions.push({
      title: 'Draft Opening Speech',
      description: 'Your speech needs to be ready for the speaker list.',
      type: 'speech',
      targetUrl: '/speech-lab',
      priority: 'high'
    });
  } else {
    missions.push({
      title: 'Rules of Procedure Drill',
      description: 'Speed-run the RoP quiz to stay sharp for the floor.',
      type: 'quiz',
      targetUrl: '/quiz-arena',
      priority: 'high'
    });
    missions.push({
      title: 'Crisis Response Training',
      description: 'Practice high-pressure directive drafting.',
      type: 'drill',
      targetUrl: '/crisis-simulator',
      priority: 'medium'
    });
  }

  return missions;
};

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      conferenceDate: null,
      missions: [],
      streak: 0,
      lastUpdated: new Date().toISOString(),
      missingSections: [],

      setConferenceDate: (date) => set({ conferenceDate: date }),

      addMission: (mission) => set((state) => ({
        missions: [
          ...state.missions,
          {
            ...mission,
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
        
        // Streak logic: check if this is the first completion of the day
        const today = new Date().toISOString().split('T')[0];
        const lastUpdate = state.lastUpdated.split('T')[0];
        let streak = state.streak;
        
        if (lastUpdate !== today) {
          streak += 1;
        }

        return { missions, streak, lastUpdated: new Date().toISOString() };
      }),

      setMissingSections: (sections) => set((state) => {
        // Generate gap missions
        const gapMissions: Mission[] = sections.map(section => ({
          id: crypto.randomUUID(),
          title: `Gap Found: ${section}`,
          description: `Your research is missing the ${section} section. Draft it now.`,
          type: 'gap',
          completed: false,
          targetUrl: '/speech-lab',
          priority: 'high',
          createdAt: new Date().toISOString()
        }));

        // Filter out existing gap missions for the same section to avoid duplicates
        const otherMissions = state.missions.filter(m => m.type !== 'gap');
        
        return { 
          missingSections: sections,
          missions: [...otherMissions, ...gapMissions]
        };
      }),

      syncMissions: (daysRemaining) => {
        const state = get();
        const baseMissions = generateMissionsForPhase(daysRemaining);
        
        // Only add if not already present by title
        const currentTitles = new Set(state.missions.map(m => m.title));
        const newMissions = baseMissions
          .filter(bm => !currentTitles.has(bm.title))
          .map(bm => ({
            ...bm,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false
          }));

        if (newMissions.length > 0) {
          set({ missions: [...state.missions, ...newMissions] });
        }
      },

      resetMissions: () => set({ missions: [], streak: 0, missingSections: [] })
    }),
    {
      name: 'smc-roadmap-v1',
    }
  )
);
