import { PatentCase } from '../../store/useCaseStore';

// Mock API for cases
export async function fetchCases(): Promise<PatentCase[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would fetch from a database or backend
  // For now, we'll return the initial state from the store or a static list
  return [
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
    }
  ];
}

export async function getDashboardStats() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalCases: 124,
    pendingOAs: 12,
    registeredPatents: 85,
    upcomingDeadlines: 5
  };
}
