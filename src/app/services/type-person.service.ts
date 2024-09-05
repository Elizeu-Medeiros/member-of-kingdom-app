import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypePerson } from '../models/type-person.model';

@Injectable({
  providedIn: 'root'
})
export class TypePersonService {
  private apiUrl = `${environment.apiUrl}/type_person`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getTypePersons(): Observable<TypePerson[]> {
    return this.http.get<TypePerson[]>(this.apiUrl);
  }

  // Método para obter um usuário específico por ID
  getTypePerson(uuid: string): Observable<TypePerson> {
    return this.http.get<TypePerson>(`${this.apiUrl}/${uuid}`);
  }

  // Método para criar um novo usuário
  createTypePerson(typePerson: TypePerson): Observable<TypePerson> {
    return this.http.post<TypePerson>(this.apiUrl, typePerson);
  }

  // Método para atualizar um usuário existente
  updateTypePerson(uuid: string, typePerson: TypePerson): Observable<TypePerson> {
    return this.http.put<TypePerson>(`${this.apiUrl}/${uuid}`, typePerson);
  }

  // Método para excluir um usuário por ID
  deleteTypePerson(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
