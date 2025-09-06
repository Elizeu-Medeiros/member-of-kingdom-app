import { Role } from "./roles.model";


export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number | null;   // <- pode vir undefined do backend
  role?: Role | null;
  password?: string;
}

// Tipo para respostas da API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { [key: string]: string[] };
}

// Tipo específico para resposta de criação/atualização de usuário
export interface UserResponse extends ApiResponse<User> {
  message: string; // Garantir que message existe
}

// Tipo para payload de criação/atualização
export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role_id?: number | null;
}

// Tipo para erros de validação do Laravel
export interface ValidationErrors {
  [key: string]: string[];
}

export interface LaravelLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginator<T> {
  current_page: number;
  data: T[];
  first_page_url?: string;
  from?: number;
  last_page: number;
  last_page_url?: string;
  links: LaravelLink[];
  next_page_url: string | null;
  path?: string;
  per_page: number;
  prev_page_url: string | null;
  to?: number;
  total: number;
}
