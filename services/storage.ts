import { User, Test, Attempt, UserRole } from '../types';

const KEYS = {
  USERS: 'nexus_users',
  TESTS: 'nexus_tests',
  ATTEMPTS: 'nexus_attempts',
  CURRENT_USER: 'nexus_current_user'
};

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Alice Teacher', email: 'teacher@jmc.com', password: '123', role: UserRole.TEACHER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Student', email: 'student@jmc.com', password: '123', role: UserRole.STUDENT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', classGrade: 'CS Dept' },
];

const INITIAL_TESTS: Test[] = [
  // 1. Computer Network
  {
    id: 't1',
    title: 'Network Fundamentals',
    subject: 'Computer Network',
    description: 'OSI Model, TCP/IP, and basic networking protocols.',
    durationMinutes: 20,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which layer of the OSI model is responsible for routing?',
        options: [
          { id: 'o1', text: 'Data Link Layer' },
          { id: 'o2', text: 'Network Layer' },
          { id: 'o3', text: 'Transport Layer' },
          { id: 'o4', text: 'Session Layer' },
        ],
        correctOptionId: 'o2'
      },
      {
        id: 'q2',
        text: 'What does HTTP stand for?',
        options: [
          { id: 'o1', text: 'HyperText Transfer Protocol' },
          { id: 'o2', text: 'High Transfer Text Protocol' },
          { id: 'o3', text: 'HyperTech Text Protocol' },
          { id: 'o4', text: 'HyperText Transmission Protocol' },
        ],
        correctOptionId: 'o1'
      }
    ]
  },
  // 2. JAVA
  {
    id: 't2',
    title: 'Core JAVA Concepts',
    subject: 'JAVA',
    description: 'OOPs, Inheritance, Polymorphism, and Exception Handling.',
    durationMinutes: 25,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which of these is not a feature of Java?',
        options: [
          { id: 'o1', text: 'Object-Oriented' },
          { id: 'o2', text: 'Platform Independent' },
          { id: 'o3', text: 'Pointers' },
          { id: 'o4', text: 'Multi-threaded' },
        ],
        correctOptionId: 'o3'
      }
    ]
  },
  // 3. C Program
  {
    id: 't3',
    title: 'C Programming Mastery',
    subject: 'C Program',
    description: 'Pointers, Memory Management, and Syntax.',
    durationMinutes: 30,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Size of int in C is usually:',
        options: [
          { id: 'o1', text: '1 byte' },
          { id: 'o2', text: '2 or 4 bytes' },
          { id: 'o3', text: '8 bytes' },
          { id: 'o4', text: '16 bytes' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  // 4. Android
  {
    id: 't4',
    title: 'Android Development',
    subject: 'Android',
    description: 'Activities, Intents, and Layouts.',
    durationMinutes: 20,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which file is the entry point of an Android App?',
        options: [
          { id: 'o1', text: 'activity_main.xml' },
          { id: 'o2', text: 'AndroidManifest.xml' },
          { id: 'o3', text: 'MainActivity.java' },
          { id: 'o4', text: 'build.gradle' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  // 5. Data Structures
  {
    id: 't5',
    title: 'Data Structures 101',
    subject: 'Data Structures',
    description: 'Arrays, Linked Lists, Stacks, and Queues.',
    durationMinutes: 25,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which data structure uses LIFO principle?',
        options: [
          { id: 'o1', text: 'Queue' },
          { id: 'o2', text: 'Stack' },
          { id: 'o3', text: 'Array' },
          { id: 'o4', text: 'Linked List' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  // 6. Operating Systems
  {
    id: 't6',
    title: 'Operating Systems',
    subject: 'OS',
    description: 'Process Scheduling, Deadlocks, and Memory Management.',
    durationMinutes: 20,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'What is a deadlock?',
        options: [
          { id: 'o1', text: 'System crash' },
          { id: 'o2', text: 'Situation where two processes wait for each other' },
          { id: 'o3', text: 'Process termination' },
          { id: 'o4', text: 'Memory leak' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  // 7. DBMS
  {
    id: 't7',
    title: 'Database Management',
    subject: 'DBMS',
    description: 'SQL Queries, Normalization, and ER Models.',
    durationMinutes: 25,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which command is used to remove a table?',
        options: [
          { id: 'o1', text: 'DELETE' },
          { id: 'o2', text: 'REMOVE' },
          { id: 'o3', text: 'DROP' },
          { id: 'o4', text: 'CLEAR' },
        ],
        correctOptionId: 'o3'
      }
    ]
  },
  // 8. Web Development
  {
    id: 't8',
    title: 'Web Technologies',
    subject: 'Web Dev',
    description: 'HTML, CSS, JavaScript and DOM manipulation.',
    durationMinutes: 15,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which tag is used for the largest heading in HTML?',
        options: [
          { id: 'o1', text: '<h6>' },
          { id: 'o2', text: '<head>' },
          { id: 'o3', text: '<h1>' },
          { id: 'o4', text: '<header>' },
        ],
        correctOptionId: 'o3'
      }
    ]
  },
  // 9. Python
  {
    id: 't9',
    title: 'Python Programming',
    subject: 'Python',
    description: 'Syntax, Data Types, and Libraries.',
    durationMinutes: 20,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which keyword is used to define a function in Python?',
        options: [
          { id: 'o1', text: 'func' },
          { id: 'o2', text: 'def' },
          { id: 'o3', text: 'function' },
          { id: 'o4', text: 'lambda' },
        ],
        correctOptionId: 'o2'
      }
    ]
  },
  // 10. Software Engineering
  {
    id: 't10',
    title: 'Software Engineering',
    subject: 'Software Eng',
    description: 'SDLC Models, Agile, and Testing.',
    durationMinutes: 15,
    createdBy: 'u1',
    createdAt: new Date().toISOString(),
    isPublished: true,
    questions: [
      {
        id: 'q1',
        text: 'Which model is also known as Verification and Validation model?',
        options: [
          { id: 'o1', text: 'Waterfall Model' },
          { id: 'o2', text: 'Agile Model' },
          { id: 'o3', text: 'V-Model' },
          { id: 'o4', text: 'Spiral Model' },
        ],
        correctOptionId: 'o3'
      }
    ]
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