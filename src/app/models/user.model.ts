// src/app/models/user.model.ts
export interface Role {
  id: number;
  name: string;                // "admin", "manager", ...
  description?: string | null;
  guard_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  uuid_user?: string;
  name: string;
  email: string;
  password?: string;
  role_id?: number | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
  role?: Role | null;
}




