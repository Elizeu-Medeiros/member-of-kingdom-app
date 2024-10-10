import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypePeople } from '../models/typePeople.model';

@Injectable({
  providedIn: 'root'
})
export class TypePeopleService {
  private apiUrl = `${environment.apiUrl}/type_people`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getTypePeoples(): Observable<TypePeople[]> {
    return this.http.get<TypePeople[]>(this.apiUrl);
  }

  // Método para obter um usuário específico por ID
  getTypePeople(uuid: string): Observable<TypePeople> {
    return this.http.get<TypePeople>(`${this.apiUrl}/${uuid}`);
  }

  // Método para criar um novo usuário
  createTypePeople(typePerson: TypePeople): Observable<TypePeople> {
    return this.http.post<TypePeople>(this.apiUrl, typePerson);
  }

  // Método para atualizar um usuário existente
  updateTypePeople(uuid: string, typePerson: TypePeople): Observable<TypePeople> {
    return this.http.put<TypePeople>(`${this.apiUrl}/${uuid}`, typePerson);
  }

  // Método para excluir um usuário por ID
  deleteTypePeople(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
