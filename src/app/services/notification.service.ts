import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { NotificationPriority, NotificationStats, NotificationType, RecentActivity, Notification } from '../models/notification.model';

// Interfaces

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Dados mockados
  private mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Novo membro cadastrado',
      message: 'Maria Santos Silva foi cadastrada como novo membro da igreja',
      type: 'member',
      priority: 'normal',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1h atrás
      actionUrl: '/members/1',
      actionText: 'Ver perfil',
      data: { memberId: 1, memberName: 'Maria Santos Silva' }
    },
    {
      id: '2',
      title: 'Evento criado',
      message: 'Reunião de Jovens foi agendada para 20/12/2024',
      type: 'event',
      priority: 'normal',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
      actionUrl: '/events/3',
      actionText: 'Ver evento',
      data: { eventId: '3', eventTitle: 'Reunião de Jovens' }
    },
    {
      id: '3',
      title: 'Backup automático concluído',
      message: 'Backup dos dados da igreja foi realizado com sucesso',
      type: 'system',
      priority: 'low',
      isRead: true,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h atrás
      readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      data: { backupSize: '2.5GB', backupTime: '10min' }
    },
    {
      id: '4',
      title: 'Aniversariantes da semana',
      message: '5 membros fazem aniversário esta semana',
      type: 'info',
      priority: 'normal',
      isRead: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h atrás
      actionUrl: '/members?filter=birthdays',
      actionText: 'Ver aniversariantes',
      data: { birthdayCount: 5 }
    },
    {
      id: '5',
      title: 'Meta de frequência atingida!',
      message: 'Culto dominical atingiu 95% da capacidade máxima',
      type: 'success',
      priority: 'high',
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      data: { eventId: '1', attendanceRate: 95 }
    },
    {
      id: '6',
      title: 'Atualização do sistema',
      message: 'Nova versão do Member Kingdom disponível (v2.1.0)',
      type: 'system',
      priority: 'normal',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actionUrl: '/settings/updates',
      actionText: 'Ver atualizações'
    }
  ];

  private mockActivities: RecentActivity[] = [
    {
      id: 'act1',
      type: 'member',
      description: 'Maria Santos Silva se tornou membro da igreja',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
      actionable: true,
      data: { memberId: 1 },
      userId: 1,
      userName: 'Pastor João'
    },
    {
      id: 'act2',
      type: 'event',
      description: 'Culto de Domingo foi criado para 15/12/2024',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h atrás
      actionable: true,
      data: { eventId: '1' },
      userId: 1,
      userName: 'Pastor João'
    },
    {
      id: 'act3',
      type: 'visitor',
      description: '3 novos visitantes registrados hoje',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h atrás
      actionable: true,
      data: { visitorCount: 3 },
      userId: 2,
      userName: 'Ana Carolina'
    },
    {
      id: 'act4',
      type: 'announcement',
      description: 'Aviso sobre reunião de líderes foi enviado',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h atrás
      actionable: false,
      data: { announcementId: 'ann1' },
      userId: 1,
      userName: 'Pastor João'
    },
    {
      id: 'act5',
      type: 'birthday',
      description: 'Pedro Oliveira faz aniversário hoje',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10h atrás
      actionable: true,
      data: { memberId: 2, memberName: 'Pedro Oliveira' },
      userId: 1,
      userName: 'Sistema'
    },
    {
      id: 'act6',
      type: 'donation',
      description: 'Nova doação de R$ 500,00 foi registrada',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      actionable: true,
      data: { amount: 500.00, donorId: 3 },
      userId: 8,
      userName: 'Carla Rodrigues'
    },
    {
      id: 'act7',
      type: 'system',
      description: 'Backup automático dos dados realizado',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      actionable: false,
      data: { backupId: 'backup123' },
      userId: 1,
      userName: 'Sistema'
    }
  ];

  private mockStats: NotificationStats = {
    totalNotifications: 25,
    unreadCount: 3,
    todayCount: 8,
    priorityDistribution: {
      'low': 5,
      'normal': 15,
      'high': 4,
      'urgent': 1
    },
    typeDistribution: {
      'info': 8,
      'success': 5,
      'warning': 3,
      'error': 2,
      'event': 4,
      'member': 2,
      'system': 1
    }
  };

  // BehaviorSubjects para estado reativo
  private notificationsSubject = new BehaviorSubject<Notification[]>(this.mockNotifications);
  private activitiesSubject = new BehaviorSubject<RecentActivity[]>(this.mockActivities);
  private unreadCountSubject = new BehaviorSubject<number>(3);
  private statsSubject = new BehaviorSubject<NotificationStats>(this.mockStats);

  // Observables públicos
  public notifications$ = this.notificationsSubject.asObservable();
  public activities$ = this.activitiesSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();

  constructor() {
    console.log('✅ NotificationService inicializado com dados mock');
    this.updateUnreadCount();
  }

  /**
   * NOTIFICAÇÕES - MOCKADAS
   */

  /**
   * Obter todas as notificações
   */
  getNotifications(limit?: number, offset?: number): Observable<Notification[]> {
    console.log('🔔 Buscando notificações...', { limit, offset });

    let notifications = [...this.mockNotifications];

    // Ordenar por data (mais recentes primeiro)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Aplicar paginação se especificada
    if (offset !== undefined) {
      notifications = notifications.slice(offset);
    }
    if (limit !== undefined) {
      notifications = notifications.slice(0, limit);
    }

    return of(notifications).pipe(
      delay(300),
      map(notifs => {
        this.notificationsSubject.next(notifs);
        return notifs;
      })
    );
  }

  /**
   * Obter notificações não lidas
   */
  getUnreadNotifications(): Observable<Notification[]> {
    console.log('📬 Buscando notificações não lidas...');

    const unreadNotifications = this.mockNotifications.filter(n => !n.isRead);

    return of(unreadNotifications).pipe(delay(200));
  }

  /**
   * Obter contagem de não lidas
   */
  getUnreadCount(): Observable<number> {
    console.log('🔢 Obtendo contagem de não lidas...');

    const count = this.mockNotifications.filter(n => !n.isRead).length;

    return of(count).pipe(
      delay(100),
      map(count => {
        this.unreadCountSubject.next(count);
        return count;
      })
    );
  }

  /**
   * Marcar notificação como lida
   */
  markAsRead(notificationId: string): Observable<Notification> {
    console.log('✅ Marcando notificação como lida:', notificationId);

    const notification = this.mockNotifications.find(n => n.id === notificationId);

    if (!notification) {
      return throwError(() => new Error('Notificação não encontrada'));
    }

    notification.isRead = true;
    notification.readAt = new Date().toISOString();

    this.updateUnreadCount();

    return of(notification).pipe(delay(200));
  }

  /**
   * Marcar todas como lidas
   */
  markAllAsRead(): Observable<void> {
    console.log('✅ Marcando todas as notificações como lidas...');

    this.mockNotifications.forEach(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
      }
    });

    this.updateUnreadCount();

    return of(void 0).pipe(delay(400));
  }

  /**
   * Deletar notificação
   */
  deleteNotification(notificationId: string): Observable<void> {
    console.log('🗑️ Deletando notificação:', notificationId);

    const index = this.mockNotifications.findIndex(n => n.id === notificationId);

    if (index === -1) {
      return throwError(() => new Error('Notificação não encontrada'));
    }

    this.mockNotifications.splice(index, 1);
    this.updateUnreadCount();

    return of(void 0).pipe(delay(300));
  }

  /**
   * Criar nova notificação
   */
  createNotification(notificationData: Partial<Notification>): Observable<Notification> {
    console.log('➕ Criando nova notificação:', notificationData);

    const newNotification: Notification = {
      id: (Math.max(...this.mockNotifications.map(n => parseInt(n.id))) + 1).toString(),
      title: notificationData.title || '',
      message: notificationData.message || '',
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'normal',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: notificationData.actionUrl,
      actionText: notificationData.actionText,
      data: notificationData.data
    };

    this.mockNotifications.unshift(newNotification); // Adicionar no início
    this.updateUnreadCount();

    return of(newNotification).pipe(delay(300));
  }

  /**
   * ATIVIDADES RECENTES - MOCKADAS
   */

  /**
   * Obter atividades recentes
   */
  getRecentActivities(limit: number = 10): Observable<RecentActivity[]> {
    console.log('📋 Buscando atividades recentes...', { limit });

    const activities = this.mockActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return of(activities).pipe(
      delay(250),
      map(acts => {
        this.activitiesSubject.next(acts);
        return acts;
      })
    );
  }

  /**
   * Adicionar nova atividade
   */
  addActivity(activityData: Partial<RecentActivity>): Observable<RecentActivity> {
    console.log('📝 Adicionando nova atividade:', activityData);

    const newActivity: RecentActivity = {
      id: `act${Date.now()}`,
      type: activityData.type || 'system',
      description: activityData.description || '',
      timestamp: new Date(),
      actionable: activityData.actionable || false,
      data: activityData.data,
      userId: activityData.userId,
      userName: activityData.userName || 'Sistema'
    };

    this.mockActivities.unshift(newActivity);

    // Manter apenas as 50 atividades mais recentes
    if (this.mockActivities.length > 50) {
      this.mockActivities = this.mockActivities.slice(0, 50);
    }

    return of(newActivity).pipe(delay(200));
  }

  /**
   * ESTATÍSTICAS - MOCKADAS
   */

  /**
   * Obter estatísticas das notificações
   */
  getNotificationStats(): Observable<NotificationStats> {
    console.log('📊 Carregando estatísticas das notificações...');

    // Recalcular stats baseado nos dados atuais
    const currentStats: NotificationStats = {
      totalNotifications: this.mockNotifications.length,
      unreadCount: this.mockNotifications.filter(n => !n.isRead).length,
      todayCount: this.getTodayNotificationsCount(),
      priorityDistribution: this.getPriorityDistribution(),
      typeDistribution: this.getTypeDistribution()
    };

    return of(currentStats).pipe(
      delay(300),
      map(stats => {
        this.statsSubject.next(stats);
        return stats;
      })
    );
  }

  /**
   * MÉTODOS AUXILIARES - MOCKADOS
   */

  /**
   * Buscar notificações
   */
  searchNotifications(term: string): Observable<Notification[]> {
    console.log('🔍 Buscando notificações por termo:', term);

    if (!term.trim()) {
      return this.getNotifications();
    }

    const searchTerm = term.toLowerCase();
    const results = this.mockNotifications.filter(n =>
      n.title.toLowerCase().includes(searchTerm) ||
      n.message.toLowerCase().includes(searchTerm)
    );

    return of(results).pipe(delay(250));
  }

  /**
   * Filtrar notificações por tipo
   */
  getNotificationsByType(type: NotificationType): Observable<Notification[]> {
    console.log('🏷️ Filtrando notificações por tipo:', type);

    const filtered = this.mockNotifications.filter(n => n.type === type);

    return of(filtered).pipe(delay(200));
  }

  /**
   * Filtrar notificações por prioridade
   */
  getNotificationsByPriority(priority: NotificationPriority): Observable<Notification[]> {
    console.log('⚡ Filtrando notificações por prioridade:', priority);

    const filtered = this.mockNotifications.filter(n => n.priority === priority);

    return of(filtered).pipe(delay(200));
  }

  /**
   * Obter notificações de hoje
   */
  getTodayNotifications(): Observable<Notification[]> {
    console.log('📅 Buscando notificações de hoje...');

    const today = new Date().toISOString().split('T')[0];

    const todayNotifications = this.mockNotifications.filter(n =>
      n.createdAt.startsWith(today)
    );

    return of(todayNotifications).pipe(delay(200));
  }

  /**
   * MÉTODOS PRIVADOS AUXILIARES
   */

  /**
   * Atualizar contagem de não lidas
   */
  private updateUnreadCount(): void {
    const count = this.mockNotifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(count);
  }

  /**
   * Contar notificações de hoje
   */
  private getTodayNotificationsCount(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.mockNotifications.filter(n => n.createdAt.startsWith(today)).length;
  }

  /**
   * Distribuição por prioridade
   */
  private getPriorityDistribution(): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};

    this.mockNotifications.forEach(n => {
      distribution[n.priority] = (distribution[n.priority] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Distribuição por tipo
   */
  private getTypeDistribution(): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};

    this.mockNotifications.forEach(n => {
      distribution[n.type] = (distribution[n.type] || 0) + 1;
    });

    return distribution;
  }

  /**
   * MÉTODOS UTILITÁRIOS PÚBLICOS
   */

  /**
   * Obter contagem atual de não lidas (síncrono)
   */
  getCurrentUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Obter notificações atuais do cache
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Obter atividades atuais do cache
   */
  getCurrentActivities(): RecentActivity[] {
    return this.activitiesSubject.value;
  }

  /**
   * Limpar todas as notificações
   */
  clearAllNotifications(): Observable<void> {
    console.log('🧹 Limpando todas as notificações...');

    this.mockNotifications = [];
    this.updateUnreadCount();
    this.notificationsSubject.next([]);

    return of(void 0).pipe(delay(300));
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.notificationsSubject.next([]);
    this.activitiesSubject.next([]);
    this.unreadCountSubject.next(0);
    this.statsSubject.next({
      totalNotifications: 0,
      unreadCount: 0,
      todayCount: 0,
      priorityDistribution: {},
      typeDistribution: {}
    });
  }

  /**
   * Simular push notification (para testes)
   */
  simulatePushNotification(title: string, message: string, type: NotificationType = 'info'): void {
    console.log('📱 Simulando push notification:', { title, message, type });

    this.createNotification({
      title,
      message,
      type,
      priority: 'normal'
    }).subscribe();

    // Simular notificação do browser (se suportado)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'assets/icons/icon-192x192.png',
        badge: 'assets/icons/badge-72x72.png'
      });
    }
  }

  /**
   * Solicitar permissão para notificações
   */
  requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('denied');
  }

  /**
   * Verificar se notificações estão habilitadas
   */
  areNotificationsEnabled(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  /**
   * Simular erro de rede (para testes)
   */
  simulateNetworkError(): Observable<never> {
    return throwError(() => new Error('Erro de conexão simulado'));
  }
}
