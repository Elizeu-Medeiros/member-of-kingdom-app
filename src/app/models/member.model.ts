export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  baptismDate?: string;
  memberSince: string;
  status: 'active' | 'inactive' | 'visitor' | 'transferred';
  department?: string;
  role?: string;
  avatar?: string;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembers: number;
  visitors: number;
  memberGrowth: number;
  averageAge: number;
  departmentDistribution: { [key: string]: number };
  monthlyGrowth: { month: string; count: number }[];
}

export interface MemberFilters {
  status?: string;
  department?: string;
  ageRange?: { min: number; max: number };
  search?: string;
  memberSince?: { start: string; end: string };
}
