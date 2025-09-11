import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { People } from '../models/people.model';
import { environment } from 'src/environments/environment';
import { Paginator } from '../models/util.model';

export interface ApiResponse<T> { message?: string; data: T; }
@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl = `${environment.apiUrl}/people`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getPeoplesPage(page = 1, search = '', perPage = 10)
    : Observable<ApiResponse<Paginator<People>>> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);
    if (search) params = params.set('search', search);

    return this.http.get<ApiResponse<Paginator<People>>>(`${this.apiUrl}`, { params });
  }

  // Método para obter um usuário específico por ID
  getPeople(id: number): Observable<People> {
    return this.http.get<People>(`${this.apiUrl}/${id}`);
  }

  // Método para criar um novo usuário
  createPeople(payload: People): Observable<ApiResponse<People>> {
    return this.http.post<ApiResponse<People>>(this.apiUrl, payload);
  }

  // Método para atualizar um usuário existente
  updatePeople(id: number, payload: People): Observable<ApiResponse<People>> {
    return this.http.put<ApiResponse<People>>(`${this.apiUrl}/${id}`, payload);
  }

  // Método para excluir um usuário por ID
  deletePeople(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
