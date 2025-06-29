export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'genie';
  timestamp: Date;
  type?: 'text' | 'voice' | 'video';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: 'career' | 'health' | 'finance' | 'personal' | 'learning';
  deadline?: Date;
  createdAt: Date;
}

export interface MoodEntry {
  id: string;
  mood: number; // 1-10 scale
  notes?: string;
  timestamp: Date;
}

export interface WisdomEntry {
  id: string;
  content: string;
  category: string;
  votes: number;
  timestamp: Date;
  anonymous: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  joinDate: Date;
}