import { ChurchesResponse, Churches } from './../models/churches.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChurchesService {
  private apiUrl = `${environment.apiUrl}/churches`;  // URL da API Laravel

  constructor(private http: HttpClient) { }

  // Método para obter todos os usuários
  getChurches(): Observable<Churches[]> {
    return this.http.get<ChurchesResponse>(this.apiUrl).pipe(
      map((response: ChurchesResponse) => {
        // Se a resposta tiver um array `data`, retornamos, senão, um array vazio
        return response?.data ?? [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao buscar igrejas:', error);
        return throwError(() => new Error('Erro ao buscar igrejas. Tente novamente mais tarde.'));
      })
    );
  }

  // Método para obter um usuário específico por ID
  getChurch(uuid: string): Observable<Churches> {
    return this.http.get<Churches>(`${this.apiUrl}/${uuid}`);
  }

  // Método para criar um novo usuário
  createChurch(typePerson: Churches): Observable<Churches> {
    return this.http.post<Churches>(this.apiUrl, typePerson);
  }

  // Método para atualizar um usuário existente
  updateChurch(uuid: string, typePerson: Churches): Observable<Churches> {
    return this.http.put<Churches>(`${this.apiUrl}/${uuid}`, typePerson);
  }

  // Método para excluir um usuário por ID
  deleteChurch(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${uuid}`);
  }
}
