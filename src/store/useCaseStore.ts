import { create } from 'zustand';

export type CaseStatus = 'DRAFT' | 'FILED' | 'OA_RECEIVED' | 'RESPONSE_SUBMITTED' | 'REGISTERED' | 'EXPIRED';

export interface PatentCase {
  id: string;
  title: string;
  country: string;
  status: CaseStatus;
  client: string;
  filingDate?: string;
  dueDate?: string;
  inventor?: string;
  patentNumber?: string;
}

interface CaseState {
  cases: PatentCase[];
  selectedCase: PatentCase | null;
  setCases: (cases: PatentCase[]) => void;
  setSelectedCase: (caseItem: PatentCase | null) => void;
  addCase: (caseItem: PatentCase) => void;
  updateCase: (id: string, updates: Partial<PatentCase>) => void;
}

export const useCaseStore = create<CaseState>((set) => ({
  cases: [
    {
      id: 'PAT-2024-001',
      title: 'AI-based Image Recognition System',
      country: 'KR',
      status: 'FILED',
      client: 'TechCorp Inc.',
      filingDate: '2024-01-15',
      dueDate: '2024-07-15',
      inventor: 'John Doe',
    },
    {
      id: 'PAT-2024-002',
      title: 'Blockchain Security Protocol',
      country: 'US',
      status: 'OA_RECEIVED',
      client: 'SecureChain Ltd.',
      filingDate: '2023-11-20',
      dueDate: '2024-05-20',
      inventor: 'Jane Smith',
    },
    {
      id: 'PAT-2024-003',
      title: 'Sustainable Energy Grid',
      country: 'EP',
      status: 'REGISTERED',
      client: 'EcoEnergy Co.',
      filingDate: '2022-06-10',
      patentNumber: 'EP1234567',
      inventor: 'Robert Brown',
    }
  ],
  selectedCase: null,
  setCases: (cases) => set({ cases }),
  setSelectedCase: (selectedCase) => set({ selectedCase }),
  addCase: (caseItem) => set((state) => ({ cases: [...state.cases, caseItem] })),
  updateCase: (id, updates) => set((state) => ({
    cases: state.cases.map((c) => (c.id === id ? { ...c, ...updates } : c))
  })),
}));
