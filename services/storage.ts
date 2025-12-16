import { User, Test, Attempt, UserRole } from '../types';

const KEYS = {
  USERS: 'nexus_users',
  TESTS: 'nexus_tests',
  ATTEMPTS: 'nexus_attempts',
  CURRENT_USER: 'nexus_current_user'
};

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Teacher', email: 'teacher@nexus.com', password: '123', role: UserRole.TEACHER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Student', email: 'student@nexus.com', password: '123', role: UserRole.STUDENT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', classGrade: '10th Grade' },
];

const INITIAL_TESTS: Test[] = [
  {
    id: 't1',
    title: 'Atomic Structure',
    subject: 'Chemistry',
    description: 'Protons, neutrons, electrons and isotopes.',
    durationMinutes: 15,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'What is the chemical symbol for Gold?',
        options: [
          { id: 'o1', text: 'Au' },
          { id: 'o2', text: 'Ag' },
          { id: 'o3', text: 'Fe' },
          { id: 'o4', text: 'Pb' },
        ],
        correctOptionId: 'o1'
      },
      {
        id: 'q2',
        text: 'Which subatomic particle has a positive charge?',
        options: [
          { id: 'o1', text: 'Electron' },
          { id: 'o2', text: 'Neutron' },
          { id: 'o3', text: 'Proton' },
          { id: 'o4', text: 'Photon' },
        ],
        correctOptionId: 'o3'
      }
    ]
  },
  {
    id: 't2',
    title: 'Kinematics 101',
    subject: 'Physics',
    description: 'Motion, velocity, and acceleration basics.',
    durationMinutes: 20,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'What is the unit of acceleration?',
        options: [
          { id: 'o1', text: 'm/s' },
          { id: 'o2', text: 'm/s²' },
          { id: 'o3', text: 'N' },
          { id: 'o4', text: 'J' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  {
    id: 't3',
    title: 'Linear Algebra',
    subject: 'Math',
    description: 'Matrices, vectors and linear equations.',
    durationMinutes: 30,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: []
  }
];

export const storageService = {
  // User & Auth
  getUsers: (): User[] => {
    const stored = localStorage.getItem(KEYS.USERS);
    return stored ? JSON.parse(stored) : INITIAL_USERS;
  },
  
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  login: (email: string, password: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Tests
  getTests: (): Test[] => {
    const stored = localStorage.getItem(KEYS.TESTS);
    return stored ? JSON.parse(stored) : INITIAL_TESTS;
  },

  saveTest: (test: Test) => {
    const tests = storageService.getTests();
    const existingIndex = tests.findIndex(t => t.id === test.id);
    if (existingIndex >= 0) {
      tests[existingIndex] = test;
    } else {
      tests.push(test);
    }
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
  },

  deleteTest: (testId: string) => {
    const tests = storageService.getTests().filter(t => t.id !== testId);
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
  },

  // Attempts
  getAttempts: (): Attempt[] => {
    const stored = localStorage.getItem(KEYS.ATTEMPTS);
    return stored ? JSON.parse(stored) : [];
  },

  saveAttempt: (attempt: Attempt) => {
    const attempts = storageService.getAttempts();
    attempts.push(attempt);
    localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(attempts));
  }
};