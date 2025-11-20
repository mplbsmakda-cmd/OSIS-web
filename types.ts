export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface Candidate {
  id: string;
  name: string;
  vision: string;
  mission: string[];
  imageUrl: string;
  voteCount: number;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  order: number;
}

export interface User {
  id: string;
  nisn: string;
  name: string;
  role: UserRole;
  hasVoted: boolean;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface RegisteredStudent {
  nisn: string;
  name: string;
}