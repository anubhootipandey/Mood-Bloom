import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

interface Mood {
  id: string;
  mood: string;
  note: string;
  date: string;
}

interface JournalEntry {
  id: string;
  content: string;
  stickers: string[];
  date: string;
  isDraft: boolean;
}

interface Challenge {
  id: number;
  progress: number;
  lastUpdated: string;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  sound: boolean;
  privacy: 'public' | 'friends' | 'private';
  name: string;
}

interface Store {
  // Moods
  moods: Mood[];
  addMood: (mood: string, note: string) => void;
  getMoodHistory: () => Mood[];
  
  // Journal
  entries: JournalEntry[];
  addEntry: (content: string, stickers: string[], isDraft: boolean) => void;
  updateEntry: (id: string, content: string, stickers: string[], isDraft: boolean) => void;
  getEntries: () => JournalEntry[];
  
  // Challenges
  challenges: Record<number, Challenge>;
  updateChallenge: (id: number, progress: number) => void;
  getPoints: () => number;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Moods
      moods: [],
      addMood: (mood: string, note: string) => set((state) => ({
        moods: [...state.moods, {
          id: crypto.randomUUID(),
          mood,
          note,
          date: format(new Date(), 'yyyy-MM-dd')
        }]
      })),
      getMoodHistory: () => get().moods,

      // Journal
      entries: [],
      addEntry: (content: string, stickers: string[], isDraft: boolean) => set((state) => ({
        entries: [...state.entries, {
          id: crypto.randomUUID(),
          content,
          stickers,
          date: format(new Date(), 'yyyy-MM-dd'),
          isDraft
        }]
      })),
      updateEntry: (id: string, content: string, stickers: string[], isDraft: boolean) => set((state) => ({
        entries: state.entries.map(entry =>
          entry.id === id ? { ...entry, content, stickers, isDraft } : entry
        )
      })),
      getEntries: () => get().entries,

      // Challenges
      challenges: {
        1: { id: 1, progress: 0, lastUpdated: '' },
        2: { id: 2, progress: 0, lastUpdated: '' },
        3: { id: 3, progress: 0, lastUpdated: '' },
        4: { id: 4, progress: 0, lastUpdated: '' },
        5: { id: 5, progress: 0, lastUpdated: '' },
      },
      updateChallenge: (id: number, progress: number) => set((state) => ({
        challenges: {
          ...state.challenges,
          [id]: {
            ...state.challenges[id],
            progress,
            lastUpdated: format(new Date(), 'yyyy-MM-dd')
          }
        }
      })),
      getPoints: () => {
        const { challenges } = get();
        return Object.values(challenges).reduce((total, challenge) => total + challenge.progress * 10, 0);
      },

      // Settings
      settings: {
        notifications: true,
        darkMode: false,
        sound: true,
        privacy: 'private' as const,
        name: ''
      },
      updateSettings: (newSettings: Partial<Settings>) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'moodbloom-storage'
    }
  )
);