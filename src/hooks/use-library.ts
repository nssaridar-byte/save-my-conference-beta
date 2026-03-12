import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LibraryDocument {
  id: string;
  title: string;
  content: string;
  type: 'Position Paper' | 'Draft Resolution' | 'Research Brief' | 'Other' | 'Image' | 'Folder';
  date: string;
  isPrivate: boolean;
  conferenceId?: string; // Linked to a specific conference
  fileCount?: number; // For folders
}

export interface LibraryState {
  documents: LibraryDocument[];
  
  // Actions
  addDocument: (doc: Omit<LibraryDocument, 'id' | 'date'>) => void;
  deleteDocument: (id: string) => void;
  getResearchForConference: (conferenceId: string) => LibraryDocument | null;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      documents: [
        {
          id: 'initial-1',
          title: "Opening Statement — UNSC",
          content: "The delegation of France recognizes the escalating tensions in the region. We propose a multi-lateral approach focused on diplomatic sovereignty and historical precedent. Past actions have shown that government stance is aligned with the latest resolutions passed by the Security Council.",
          type: "Research Brief",
          date: "Recently",
          isPrivate: true,
          conferenceId: undefined
        }
      ],

      addDocument: (doc) => set((state) => ({
        documents: [
          ...state.documents,
          {
            ...doc,
            id: crypto.randomUUID(),
            date: new Date().toLocaleDateString(),
          }
        ]
      })),

      deleteDocument: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),

      getResearchForConference: (conferenceId) => {
        const { documents } = get();
        // Return documents specifically for this conference
        return documents.find(d => d.conferenceId === conferenceId && (d.type === 'Research Brief' || d.type === 'Position Paper')) || 
               null;
      }
    }),
    {
      name: 'smc-library-v1',
    }
  )
);
