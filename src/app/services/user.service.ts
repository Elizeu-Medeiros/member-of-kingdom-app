import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model'; // Importe o modelo de usuário que você criou
import { environment } from 'src/environments/environment';
import { ApiResponse, Paginated } from '../models/util.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getUsers(page = 1): Observable<User[]> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`).pipe(
      map(res => res?.data ?? [])
    );
  }

  // Método para obter um usuário específico por ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Método para criar um novo usuário
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Método para atualizar um usuário existente
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Método para excluir um usuário por ID
  deleteUser(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  getUsersPage(page = 1, search = '', perPage = 10) {
  let params = new HttpParams().set('page', page).set('per_page', perPage);
  if (search) params = params.set('search', search);
  return this.http
    .get<ApiResponse<Paginated<User>>>(this.apiUrl, { params })
    .pipe(map(res => res.data)); // wrapper {message, data}
}
}
