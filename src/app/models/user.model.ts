import { Role } from "./roles.model";
import { ApiResponse } from "./util.model";


export interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number | null;   // <- pode vir undefined do backend
  role?: Role | null;
  password?: string;
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



