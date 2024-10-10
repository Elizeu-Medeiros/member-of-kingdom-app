import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { People, PeoplesResponse } from '../models/people.model';
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
  // updatePeople(fk_people: string, People: People): Observable<People> {
  //   return this.http.put<People>(`${this.apiUrl}/${fk_people}`, People);
  // }
  updatePeople(uuid: string, people: People): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${uuid}`, people, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  // Método para excluir um usuário por ID
  deletePeople(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
