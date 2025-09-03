import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Role } from '../models/user.model'; // Importe o modelo de usuário que você criou
import { environment } from 'src/environments/environment';
import { ApiResponse, Paginated } from '../models/util.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getRoles(): Observable<Role[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        return (list ?? []).map((r: any) => ({
          id: Number(r.id),
          name: r.name,
          description: r.description ?? null,
          guard_name: r.guard_name ?? null,
          created_at: r.created_at,
          updated_at: r.updated_at,
        }) as Role);
      })
    );
  }

  // Método para obter um usuário específico por ID
  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  // Método para criar um novo usuário
  createRole(Role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, Role);
  }

  // Método para atualizar um usuário existente
  updateRole(id: number, Role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, Role);
  }

  // Método para excluir um usuário por ID
  deleteRole(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  getRolesPage(page = 1, search = '', perPage = 10) {
  let params = new HttpParams().set('page', page).set('per_page', perPage);
  if (search) params = params.set('search', search);
  return this.http
    .get<ApiResponse<Paginated<Role>>>(this.apiUrl, { params })
    .pipe(map(res => res.data)); // wrapper {message, data}
}
}
