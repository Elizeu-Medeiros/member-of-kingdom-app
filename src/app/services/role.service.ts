import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Role } from '../models/roles.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;; // Substitua pela sua URL

  constructor(private http: HttpClient) { }

  /**
   * Buscar todos os papéis
   */
  getRoles() {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(resp => {
        // aceita: [], {data: []}, {data: {data: []}}, {message, data: []}
        if (Array.isArray(resp)) return resp;
        if (Array.isArray(resp?.data)) return resp.data;
        if (Array.isArray(resp?.data?.data)) return resp.data.data;
        // fallback: se vier objeto indexado (ex.: {"1":{..},"2":{..}})
        if (resp && typeof resp === 'object') return Object.values(resp);
        return [];
      })
    );
  }
  /**
   * Buscar papel por ID
   */
  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }
}

