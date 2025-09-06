import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Paginator } from '../models/user.model';
import { environment } from 'src/environments/environment';

export interface ApiResponse<T> { message?: string; data: T; }

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Substitua pela sua URL

  constructor(private http: HttpClient) { }

  /**
   * Buscar usuário por ID
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUsersPage(page = 1, search = '', perPage = 10)
    : Observable<ApiResponse<Paginator<User>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);
    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<Paginator<User>>>(`${this.apiUrl}`, { params });
  }

  updateUser(id: number, payload: Partial<User> & { password_confirmation?: string }) {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, payload);
  }

  createUser(payload: Partial<User> & { password: string; password_confirmation?: string }) {
    return this.http.post<ApiResponse<User>>(this.apiUrl, payload);
  }

  /**
   * Listar todos os usuários
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`);
  }

  /**
   * Deletar usuário
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
