export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In real app, never store plain text
  avatarUrl?: string;
  classGrade?: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string; // Added subject for the grid view
  description: string;
  durationMinutes: number;
  createdBy: string;
  createdAt: string;
  questions: Question[];
  isPublished: boolean;
}

export interface Attempt {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  responses: Record<string, string>; // questionId -> optionId
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}