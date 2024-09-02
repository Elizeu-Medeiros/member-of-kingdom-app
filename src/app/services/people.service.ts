import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { People } from '../models/people.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl = `${environment.apiUrl}/people`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getPeoples(): Observable<People[]> {
    return this.http.get<People[]>(this.apiUrl);
  }

  // Método para obter um usuário específico por ID
  getPeople(id: number): Observable<People> {
    return this.http.get<People>(`${this.apiUrl}/${id}`);
  }

  // Método para criar um novo usuário
  createPeople(People: People): Observable<People> {
    return this.http.post<People>(this.apiUrl, People);
  }

  // Método para atualizar um usuário existente
  updatePeople(id: number, People: People): Observable<People> {
    return this.http.put<People>(`${this.apiUrl}/${id}`, People);
  }

  // Método para excluir um usuário por ID
  deletePeople(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
