// src/app/models/church.model.ts
export interface ChurchInfo {
  id: string;
  name: string;
  address?: string;
  pastor?: string;
  memberCount?: number;
  foundedDate?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  upcomingEvents: number;
  newVisitors: number;
  memberGrowth: number;
}
export interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  location?: string;
  type: string;
  attendees?: number;
}
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  churchId: string;
}
export interface MemberFilters {
  role?: string;
  churchId?: string;
}
