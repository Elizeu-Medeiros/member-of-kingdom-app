// src/app/services/member.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member, MemberFilters, MemberStats } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/members`;
  private membersSubject = new BehaviorSubject<Member[]>([]);
  private statsSubject = new BehaviorSubject<MemberStats | null>(null);

  // Observables públicos
  public members$ = this.membersSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  /**
   * Carregar dados iniciais
   */
  private loadInitialData() {
    this.getMembers().subscribe();
    this.getMemberStats().subscribe();
  }

  /**
   * Obter headers com autenticação
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * CRUD OPERATIONS
   */

  /**
   * Listar todos os membros
   */
  getMembers(filters?: MemberFilters): Observable<Member[]> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            params = params.set(key, JSON.stringify(value));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<{ data: Member[] }>(`${this.apiUrl}`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      map(response => response.data || response as any),
      tap(members => this.membersSubject.next(members)),
      catchError(this.handleError)
    );
  }

  /**
   * Obter membro por ID
   */
  getMember(id: number): Observable<Member> {
    return this.http.get<{ data: Member }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  /**
   * Criar novo membro
   */
  createMember(memberData: Partial<Member>): Observable<Member> {
    return this.http.post<{ data: Member }>(`${this.apiUrl}`, memberData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data || response as any),
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * Atualizar membro
   */
  updateMember(id: number, memberData: Partial<Member>): Observable<Member> {
    return this.http.put<{ data: Member }>(`${this.apiUrl}/${id}`, memberData, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data || response as any),
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * Deletar membro
   */
  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * ESTATÍSTICAS E RELATÓRIOS
   */

  /**
   * Obter estatísticas dos membros
   */
  getMemberStats(): Observable<MemberStats> {
    return this.http.get<{ data: MemberStats }>(`${this.apiUrl}/stats`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data || response as any),
      tap(stats => this.statsSubject.next(stats)),
      catchError(error => {
        console.error('Erro ao carregar stats:', error);
        // Retornar dados mock em caso de erro
        const mockStats: MemberStats = {
          totalMembers: 250,
          activeMembers: 185,
          inactiveMembers: 65,
          newMembers: 12,
          visitors: 8,
          memberGrowth: 8.5,
          averageAge: 42,
          departmentDistribution: {
            'Adultos': 120,
            'Jovens': 45,
            'Crianças': 35,
            'Idosos': 50
          },
          monthlyGrowth: [
            { month: 'Jan', count: 5 },
            { month: 'Fev', count: 8 },
            { month: 'Mar', count: 12 },
            { month: 'Abr', count: 7 },
            { month: 'Mai', count: 15 },
            { month: 'Jun', count: 10 }
          ]
        };
        this.statsSubject.next(mockStats);
        return [mockStats];
      })
    );
  }

  /**
   * Membros recentes (últimos 30 dias)
   */
  getRecentMembers(limit: number = 10): Observable<Member[]> {
    return this.http.get<{ data: Member[] }>(`${this.apiUrl}/recent`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('limit', limit.toString())
    }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  /**
   * Aniversariantes do mês
   */
  getBirthdayMembers(month?: number): Observable<Member[]> {
    const currentMonth = month || new Date().getMonth() + 1;

    return this.http.get<{ data: Member[] }>(`${this.apiUrl}/birthdays`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('month', currentMonth.toString())
    }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  /**
   * FUNÇÕES ESPECÍFICAS
   */

  /**
   * Buscar membros por termo
   */
  searchMembers(term: string): Observable<Member[]> {
    if (!term.trim()) {
      return this.getMembers();
    }

    return this.http.get<{ data: Member[] }>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: new HttpParams().set('q', term)
    }).pipe(
      map(response => response.data || response as any),
      catchError(this.handleError)
    );
  }

  /**
   * Atualizar status do membro
   */
  updateMemberStatus(id: number, status: Member['status']): Observable<Member> {
    return this.http.patch<{ data: Member }>(`${this.apiUrl}/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.data || response as any),
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * Upload de foto do membro
   */
  uploadMemberPhoto(id: number, photo: File): Observable<{ avatar: string }> {
    const formData = new FormData();
    formData.append('photo', photo);

    return this.http.post<{ data: { avatar: string } }>(`${this.apiUrl}/${id}/photo`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': localStorage.getItem('auth_token') ?
            `Bearer ${localStorage.getItem('auth_token')}` : ''
        })
      }
    ).pipe(
      map(response => response.data || response as any),
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * Exportar membros para Excel/CSV
   */
  exportMembers(format: 'excel' | 'csv' = 'excel', filters?: MemberFilters): Observable<Blob> {
    let params = new HttpParams().set('format', format);

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
        }
      });
    }

    return this.http.get(`${this.apiUrl}/export`, {
      headers: this.getHeaders(),
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Importar membros de arquivo
   */
  importMembers(file: File): Observable<{ imported: number; errors: any[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ data: { imported: number; errors: any[] } }>(`${this.apiUrl}/import`,
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': localStorage.getItem('auth_token') ?
            `Bearer ${localStorage.getItem('auth_token')}` : ''
        })
      }
    ).pipe(
      map(response => response.data || response as any),
      tap(() => this.refreshData()),
      catchError(this.handleError)
    );
  }

  /**
   * MÉTODOS AUXILIARES
   */

  /**
   * Atualizar dados locais
   */
  private refreshData(): void {
    this.getMembers().subscribe();
    this.getMemberStats().subscribe();
  }

  /**
   * Limpar cache local
   */
  clearCache(): void {
    this.membersSubject.next([]);
    this.statsSubject.next(null);
  }

  /**
   * Obter membro atual do cache
   */
  getCurrentMembers(): Member[] {
    return this.membersSubject.value;
  }

  /**
   * Obter stats atuais do cache
   */
  getCurrentStats(): MemberStats | null {
    return this.statsSubject.value;
  }

  /**
   * Validar dados do membro
   */
  validateMemberData(memberData: Partial<Member>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!memberData.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!memberData.email?.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email)) {
      errors.push('Email deve ter formato válido');
    }

    if (memberData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(memberData.phone)) {
      errors.push('Telefone deve ter formato (99) 99999-9999');
    }

    if (memberData.birthDate) {
      const birthDate = new Date(memberData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 0 || age > 120) {
        errors.push('Data de nascimento inválida');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Tratamento de erros
   */
  private handleError = (error: any): Observable<never> => {
    console.error('Erro no MemberService:', error);

    let errorMessage = 'Erro interno do servidor';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  };
}
