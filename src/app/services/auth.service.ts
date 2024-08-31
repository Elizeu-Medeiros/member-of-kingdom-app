import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) { }

  // Get user session
  getSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/session`);
  }

  // Chame este método após o login bem-sucedido
  storeToken(token: string): void {
    this.tokenService.setToken(token);
  }

  // Sign in
  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Salva o token e os dados do usuário no local storage
        this.tokenService.setToken(response.access_token);
        this.tokenService.setUser(response.user);
      })
    );
  }

  // Sign up
  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password });
  }

  // Sign out
  signOut(): Observable<any> {
    const token = this.tokenService.getToken();
    if (token) {
      return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).pipe(
        tap(() => this.tokenService.signOut()) // Executa ação adicional quando a resposta for recebida
      );
    }
    // Retorna um Observable vazio caso não haja token
    return of(null);
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return !!token; // Retorna verdadeiro se o token existir
  }

}
