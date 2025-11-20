import { User, UserRole, Candidate, NewsItem, RegisteredStudent, OrganizationMember } from "../types";
import { MOCK_CANDIDATES, MOCK_NEWS } from "../constants";

// --- SIMULATED DATABASE KEYS ---
const STORAGE_KEYS = {
  VOTED_PREFIX: 'osis_voted_',
  USER_SESSION: 'osis_session',
  VOTE_COUNTS: 'osis_counts',
  SETTINGS_VOTING_OPEN: 'osis_voting_open',
  DATA_CANDIDATES: 'osis_data_candidates',
  DATA_STUDENTS: 'osis_data_students',
  DATA_NEWS: 'osis_data_news',
  DATA_ORG: 'osis_data_org'
};

// --- TYPES FOR API RESPONSES ---
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// --- HELPER TO SIMULATE NETWORK DELAY ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- INITIALIZATION ---
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DATA_CANDIDATES)) {
    localStorage.setItem(STORAGE_KEYS.DATA_CANDIDATES, JSON.stringify(MOCK_CANDIDATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DATA_NEWS)) {
    // Ensure MOCK_NEWS has content field populated if missing in constants
    const cleanNews = MOCK_NEWS.map(n => ({...n, content: n.content || n.excerpt + "..."}));
    localStorage.setItem(STORAGE_KEYS.DATA_NEWS, JSON.stringify(cleanNews));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DATA_ORG)) {
    const defaultOrg: OrganizationMember[] = [
      { id: '1', name: 'Bpk. Pembina, S.Pd', position: 'Pembina OSIS', imageUrl: 'https://ui-avatars.com/api/?name=Pembina&background=random', order: 1 },
      { id: '2', name: 'Ketua Demisioner', position: 'Ketua OSIS 23/24', imageUrl: 'https://ui-avatars.com/api/?name=Ketua&background=random', order: 2 }
    ];
    localStorage.setItem(STORAGE_KEYS.DATA_ORG, JSON.stringify(defaultOrg));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DATA_STUDENTS)) {
    // Seed some dummy students for testing if empty
    const dummyStudents: RegisteredStudent[] = [
      { nisn: '12345', name: 'Siswa Tester 1' },
      { nisn: '54321', name: 'Siswa Tester 2' }
    ];
    localStorage.setItem(STORAGE_KEYS.DATA_STUDENTS, JSON.stringify(dummyStudents));
  }
};

initializeData();

export const apiService = {
  
  // --- AUTH ENDPOINTS ---
  auth: {
    loginStudent: async (nisn: string): Promise<ApiResponse<User>> => {
      await delay(800);
      const studentsRaw = localStorage.getItem(STORAGE_KEYS.DATA_STUDENTS);
      const students: RegisteredStudent[] = studentsRaw ? JSON.parse(studentsRaw) : [];
      const student = students.find(s => s.nisn === nisn);
      
      if (!student) return { success: false, message: 'NISN tidak terdaftar dalam sistem DPT. Hubungi panitia.' };

      const hasVoted = localStorage.getItem(`${STORAGE_KEYS.VOTED_PREFIX}${nisn}`) === 'true';
      
      const user: User = {
        id: `student-${nisn}`,
        nisn,
        name: student.name,
        role: UserRole.STUDENT,
        hasVoted
      };

      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
      return { success: true, data: user };
    },

    loginAdmin: async (password: string): Promise<ApiResponse<User>> => {
      await delay(1000);
      // Hardcoded admin password for simulation
      if (password === 'admin123') {
        const adminUser: User = {
          id: 'admin-master',
          nisn: 'ADMIN',
          name: 'Administrator',
          role: UserRole.ADMIN,
          hasVoted: false
        };
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(adminUser));
        return { success: true, data: adminUser };
      }
      return { success: false, message: 'Kunci akses tidak valid.' };
    },

    logout: async (): Promise<ApiResponse<null>> => {
      await delay(500);
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      return { success: true };
    },

    getSession: (): User | null => {
      const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return session ? JSON.parse(session) : null;
    }
  },

  // --- VOTING ENDPOINTS ---
  voting: {
    submitVote: async (candidateId: string, userNisn: string): Promise<ApiResponse<boolean>> => {
      await delay(1200);
      const isOpen = localStorage.getItem(STORAGE_KEYS.SETTINGS_VOTING_OPEN) !== 'false'; 
      if (!isOpen) return { success: false, message: 'Sesi pemungutan suara sedang ditutup oleh admin.' };

      if (localStorage.getItem(`${STORAGE_KEYS.VOTED_PREFIX}${userNisn}`) === 'true') {
        return { success: false, message: 'Anda sudah menggunakan hak suara.' };
      }

      localStorage.setItem(`${STORAGE_KEYS.VOTED_PREFIX}${userNisn}`, 'true');
      const currentCounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTE_COUNTS) || '{}');
      currentCounts[candidateId] = (currentCounts[candidateId] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.VOTE_COUNTS, JSON.stringify(currentCounts));

      const currentUser = apiService.auth.getSession();
      if (currentUser) {
        currentUser.hasVoted = true;
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(currentUser));
      }

      return { success: true, message: 'Suara berhasil direkam.' };
    },

    getLiveResults: async (): Promise<ApiResponse<Record<string, number>>> => {
      await delay(500);
      const storedCounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTE_COUNTS) || '{}');
      const candidatesRaw = localStorage.getItem(STORAGE_KEYS.DATA_CANDIDATES);
      const candidates: Candidate[] = candidatesRaw ? JSON.parse(candidatesRaw) : [];

      const results: Record<string, number> = {};
      candidates.forEach(c => {
        results[c.id] = (c.voteCount || 0) + (storedCounts[c.id] || 0);
      });

      return { success: true, data: results };
    },

    resetVotes: async (): Promise<ApiResponse<boolean>> => {
      await delay(1500);
      localStorage.removeItem(STORAGE_KEYS.VOTE_COUNTS);
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_KEYS.VOTED_PREFIX)) localStorage.removeItem(key);
      });
      return { success: true, message: 'Data suara di-reset.' };
    },

    toggleVotingStatus: async (isOpen: boolean): Promise<ApiResponse<boolean>> => {
      await delay(500);
      localStorage.setItem(STORAGE_KEYS.SETTINGS_VOTING_OPEN, String(isOpen));
      return { success: true, message: isOpen ? 'Voting Dibuka' : 'Voting Ditutup' };
    },

    getVotingStatus: (): boolean => {
      return localStorage.getItem(STORAGE_KEYS.SETTINGS_VOTING_OPEN) !== 'false';
    }
  },

  // --- CONTENT MANAGEMENT ENDPOINTS ---
  content: {
    // CANDIDATES
    getCandidates: async (): Promise<ApiResponse<Candidate[]>> => {
      await delay(600);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_CANDIDATES);
      return { success: true, data: raw ? JSON.parse(raw) : [] };
    },

    addCandidate: async (candidate: Candidate): Promise<ApiResponse<Candidate[]>> => {
      await delay(800);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_CANDIDATES);
      const current: Candidate[] = raw ? JSON.parse(raw) : [];
      const newCandidates = [...current, candidate];
      localStorage.setItem(STORAGE_KEYS.DATA_CANDIDATES, JSON.stringify(newCandidates));
      return { success: true, data: newCandidates };
    },

    deleteCandidate: async (id: string): Promise<ApiResponse<Candidate[]>> => {
      await delay(500);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_CANDIDATES);
      let current: Candidate[] = raw ? JSON.parse(raw) : [];
      current = current.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.DATA_CANDIDATES, JSON.stringify(current));
      return { success: true, data: current };
    },

    // NEWS
    getNews: async (): Promise<ApiResponse<NewsItem[]>> => {
      await delay(600);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_NEWS);
      return { success: true, data: raw ? JSON.parse(raw) : [] };
    },

    addNews: async (news: NewsItem): Promise<ApiResponse<NewsItem[]>> => {
      await delay(600);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_NEWS);
      const current: NewsItem[] = raw ? JSON.parse(raw) : [];
      // Add to beginning of array
      const newList = [news, ...current];
      localStorage.setItem(STORAGE_KEYS.DATA_NEWS, JSON.stringify(newList));
      return { success: true, data: newList };
    },

    deleteNews: async (id: string): Promise<ApiResponse<NewsItem[]>> => {
      await delay(400);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_NEWS);
      let current: NewsItem[] = raw ? JSON.parse(raw) : [];
      current = current.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.DATA_NEWS, JSON.stringify(current));
      return { success: true, data: current };
    },

    // ORGANIZATION
    getOrganization: async (): Promise<ApiResponse<OrganizationMember[]>> => {
      await delay(500);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_ORG);
      const data: OrganizationMember[] = raw ? JSON.parse(raw) : [];
      // Sort by order
      data.sort((a, b) => a.order - b.order);
      return { success: true, data };
    },

    addOrganizationMember: async (member: OrganizationMember): Promise<ApiResponse<OrganizationMember[]>> => {
      await delay(500);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_ORG);
      const current: OrganizationMember[] = raw ? JSON.parse(raw) : [];
      const newList = [...current, member];
      localStorage.setItem(STORAGE_KEYS.DATA_ORG, JSON.stringify(newList));
      return { success: true, data: newList };
    },

    deleteOrganizationMember: async (id: string): Promise<ApiResponse<OrganizationMember[]>> => {
      await delay(400);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_ORG);
      let current: OrganizationMember[] = raw ? JSON.parse(raw) : [];
      current = current.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.DATA_ORG, JSON.stringify(current));
      return { success: true, data: current };
    }
  },

  // --- STUDENT MANAGEMENT ENDPOINTS ---
  admin: {
    getStudents: async (): Promise<ApiResponse<RegisteredStudent[]>> => {
      await delay(600);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_STUDENTS);
      return { success: true, data: raw ? JSON.parse(raw) : [] };
    },

    addStudent: async (student: RegisteredStudent): Promise<ApiResponse<RegisteredStudent[]>> => {
      await delay(400);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_STUDENTS);
      const current: RegisteredStudent[] = raw ? JSON.parse(raw) : [];
      
      if (current.find(s => s.nisn === student.nisn)) {
        return { success: false, message: 'NISN sudah terdaftar.' };
      }

      const newList = [...current, student];
      localStorage.setItem(STORAGE_KEYS.DATA_STUDENTS, JSON.stringify(newList));
      return { success: true, data: newList };
    },

    deleteStudent: async (nisn: string): Promise<ApiResponse<RegisteredStudent[]>> => {
      await delay(400);
      const raw = localStorage.getItem(STORAGE_KEYS.DATA_STUDENTS);
      let current: RegisteredStudent[] = raw ? JSON.parse(raw) : [];
      current = current.filter(s => s.nisn !== nisn);
      localStorage.setItem(STORAGE_KEYS.DATA_STUDENTS, JSON.stringify(current));
      return { success: true, data: current };
    }
  }
};