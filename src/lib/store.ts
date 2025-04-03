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

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  date: string;
  completed: boolean;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

interface StudySubject {
  id: string;
  name: string;
  color: string;
  totalHours: number;
  targetHours: number;
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
  deleteMood: (id: string) => void;
  getMoodHistory: () => Mood[];
  
  // Journal
  entries: JournalEntry[];
  addEntry: (content: string, stickers: string[], isDraft: boolean) => void;
  updateEntry: (id: string, content: string, stickers: string[], isDraft: boolean) => void;
  deleteEntry: (id: string) => void;
  getEntries: () => JournalEntry[];
  
  // Challenges
  challenges: Record<number, Challenge>;
  updateChallenge: (id: number, progress: number) => void;
  getPoints: () => number;
  
  // Study Planner
  studySessions: StudySession[];
  subjects: StudySubject[];
  addStudySession: (session: Omit<StudySession, 'id'>) => void;
  updateStudySession: (id: string, session: Partial<StudySession>) => void;
  deleteStudySession: (id: string) => void;
  addSubject: (subject: Omit<StudySubject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<StudySubject>) => void;
  deleteSubject: (id: string) => void;
  getStudySessions: () => StudySession[];
  getSubjects: () => StudySubject[];
  
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
      deleteMood: (id: string) => set((state) => ({
        moods: state.moods.filter(mood => mood.id !== id)
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
      deleteEntry: (id: string) => set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id)
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

      // Study Planner
      studySessions: [],
      subjects: [],
      addStudySession: (session) => set((state) => ({
        studySessions: [...state.studySessions, {
          ...session,
          id: crypto.randomUUID()
        }]
      })),
      updateStudySession: (id, session) => set((state) => ({
        studySessions: state.studySessions.map(s =>
          s.id === id ? { ...s, ...session } : s
        )
      })),
      deleteStudySession: (id) => set((state) => ({
        studySessions: state.studySessions.filter(s => s.id !== id)
      })),
      addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, {
          ...subject,
          id: crypto.randomUUID()
        }]
      })),
      updateSubject: (id, subject) => set((state) => ({
        subjects: state.subjects.map(s =>
          s.id === id ? { ...s, ...subject } : s
        )
      })),
      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id),
        studySessions: state.studySessions.filter(s => s.subject !== id)
      })),
      getStudySessions: () => get().studySessions,
      getSubjects: () => get().subjects,

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