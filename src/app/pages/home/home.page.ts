// import { TokenService } from './../../services/token.service';

// import { Component, OnInit } from '@angular/core';
// import { UtilService } from 'src/app/services/util.service';
// import { NavigationExtras } from '@angular/router';
// import { register } from 'swiper/element';

// register();
// @Component({
//   selector: 'app-home',
//   templateUrl: './home.page.html',
//   styleUrls: ['./home.page.scss'],
// })
// export class HomePage implements OnInit {
//   slideOtp = {
//     initialSlide: 0,
//     slidesPerView: 1,
//     spaceBetween: 10,
//   };

//   slideOtpCategories = {
//     initialSlide: 0,
//     slidesPerView: 4,
//     spaceBetween: 10,
//   };

//   user: any;

//   constructor(
//     public util: UtilService,
//     private tokenService: TokenService,
//   ) { }

//   ngOnInit() {
//     // Obtém os dados do usuário do localStorage usando TokenService
//     this.user = this.tokenService.getUser();
//   }



// }

// // dashboard.page.ts - MEMBER KINGDOM DASHBOARD
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { MemberService } from 'src/app/services/member.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ChurchInfo } from 'src/app/models/church.model';
import { DashboardStats } from 'src/app/models/dashboard.model';
import { UpcomingEvent } from 'src/app/models/event.model';
import { Member, MemberFilters, MemberStats } from 'src/app/models/member.model';

import { Notification } from 'src/app/models/notification.model';
import { TokenService } from 'src/app/services/token.service';
import { register } from 'swiper/element';
import { NavigationExtras } from '@angular/router';
// Interfaces


interface RecentActivity {
  id: string;
  type: 'member' | 'event' | 'visitor' | 'announcement' | 'system';
  description: string;
  timestamp: Date;
  actionable: boolean;
  data?: any;
}




register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  // Data Properties
  user: User | null = null;
  churchInfo: ChurchInfo | null = null;
  stats: DashboardStats | null = null;
  recentActivities: RecentActivity[] = [];
  upcomingEvents: UpcomingEvent[] = [];

  // State Properties
  isLoading = false;
  notificationCount = 0;

  // Subscriptions
  private refreshSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  constructor(
    private router: Router,
    private util: UtilService,
    private userService: UserService,
    private eventService: EventService,
    private memberService: MemberService,
    private notificationService: NotificationService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    console.log('🏠 Inicializando Dashboard...');
    this.loadDashboardData();
    this.setupAutoRefresh();
    this.setupNotifications();

    this.user = this.tokenService.getUser();
  }

  ngOnDestroy() {
    // Limpar subscriptions
    this.refreshSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
  }

  /**
   * CARREGAMENTO PRINCIPAL DOS DADOS
   */
  async loadDashboardData() {
    this.isLoading = true;

    try {
      // Carregar dados em paralelo
      await Promise.all([
        this.loadUserInfo(),
        this.loadChurchInfo(),
        this.loadStats(),
        this.loadRecentActivities(),
        this.loadUpcomingEvents()
      ]);

      console.log('✅ Dashboard carregado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
      this.showToast('Erro ao carregar dados do dashboard', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Carregar informações do usuário atual
   */
  private async loadUserInfo() {
    try {
      // Simular carregamento - substitua pela chamada real da API
      this.user = {
        id: 1,
        name: 'Pastor João Silva',
        email: 'joao@igreja.com',
        // avatar: 'assets/images/avatars/pastor.jpg',
        role: { id: 1, name: 'Pastor' }
      };
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }

  /**
   * Carregar informações da igreja
   */
  private async loadChurchInfo() {
    try {
      // Simular carregamento - substitua pela chamada real da API
      this.churchInfo = {
        id: '1',
        name: 'Igreja Batista Central',
        address: 'Rua das Flores, 123 - Centro',
        pastor: 'Pastor João Silva',
        memberCount: 250
      };
    } catch (error) {
      console.error('Erro ao carregar info da igreja:', error);
    }
  }

  /**
   * Carregar estatísticas do dashboard
   */
  private async loadStats() {
    try {
      // Simular dados - substitua pelas chamadas reais da API
      this.stats = {
        totalMembers: 250,
        activeMembers: 185,
        upcomingEvents: 8,
        newVisitors: 12,
        memberGrowth: 8.5
      };
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Fallback para dados vazios
      this.stats = {
        totalMembers: 0,
        activeMembers: 0,
        upcomingEvents: 0,
        newVisitors: 0,
        memberGrowth: 0
      };
    }
  }

  /**
   * Carregar atividades recentes
   */
  private async loadRecentActivities() {
    try {
      // Simular dados - substitua pela chamada real da API
      this.recentActivities = [
        {
          id: '1',
          type: 'member',
          description: 'Maria Santos se tornou membro da igreja',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h atrás
          actionable: true,
          data: { memberId: '123' }
        },
        {
          id: '2',
          type: 'event',
          description: 'Culto de Domingo foi criado para 15/12',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h atrás
          actionable: true,
          data: { eventId: '456' }
        },
        {
          id: '3',
          type: 'visitor',
          description: '3 novos visitantes registrados hoje',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h atrás
          actionable: true
        },
        {
          id: '4',
          type: 'announcement',
          description: 'Aviso sobre reunião de líderes enviado',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
          actionable: false
        }
      ];
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      this.recentActivities = [];
    }
  }

  /**
   * Carregar próximos eventos
   */
  private async loadUpcomingEvents() {
    try {
      // Simular dados - substitua pela chamada real da API
      const today = new Date();
      this.upcomingEvents = [
        {
          id: '1',
          title: 'Culto Dominical',
          date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // em 2 dias
          startTime: '09:00',
          location: 'Santuário Principal',
          type: 'Culto',
          attendees: 180
        },
        {
          id: '2',
          title: 'Estudo Bíblico',
          date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // em 3 dias
          startTime: '19:30',
          location: 'Sala 2',
          type: 'Estudo',
          attendees: 45
        },
        {
          id: '3',
          title: 'Reunião de Jovens',
          date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // em 5 dias
          startTime: '19:00',
          location: 'Auditório',
          type: 'Jovens',
          attendees: 32
        }
      ];
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      this.upcomingEvents = [];
    }
  }

  /**
   * MÉTODOS DE NAVEGAÇÃO
   */
  navigateTo(route: string, params?: any) {
    if (params) {
      this.router.navigate([route], { queryParams: params });
    } else {
      this.router.navigate([route]);
    }
  }

  /**
   * MÉTODOS AUXILIARES PARA TEMPLATE
   */
  getWelcomeMessage(): string {
    const hour = new Date().getHours();

    if (hour < 12) return 'Bom dia! Tenha um dia abençoado.';
    if (hour < 18) return 'Boa tarde! Como está o ministério hoje?';
    return 'Boa noite! Finalizando mais um dia de serviço.';
  }

  getActivePercentage(): number {
    if (!this.stats?.totalMembers || this.stats.totalMembers === 0) return 0;
    return Math.round((this.stats.activeMembers / this.stats.totalMembers) * 100);
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'member': return 'person-add';
      case 'event': return 'calendar';
      case 'visitor': return 'eye';
      case 'announcement': return 'megaphone';
      case 'system': return 'settings';
      default: return 'information-circle';
    }
  }

  formatActivityTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  }

  getEventDay(date: Date): string {
    return date.getDate().toString().padStart(2, '0');
  }

  getEventMonth(date: Date): string {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[date.getMonth()];
  }

  formatEventTime(time: string): string {
    // Converter 24h para formato amigável
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getEventTypeColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'culto': return 'primary';
      case 'estudo': return 'secondary';
      case 'jovens': return 'tertiary';
      case 'reunião': return 'warning';
      default: return 'medium';
    }
  }

  /**
   * MÉTODOS DE AÇÃO
   */
  async openNotifications() {
    // Implementar abertura de notificações
    this.navigateTo('/notifications');
  }

  async openProfile() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Perfil',
      buttons: [
        {
          text: 'Ver Perfil',
          icon: 'person',
          handler: () => this.navigateTo('/profile')
        },
        {
          text: 'Configurações',
          icon: 'settings',
          handler: () => this.navigateTo('/settings')
        },
        {
          text: 'Sair',
          icon: 'log-out',
          role: 'destructive',
          handler: () => this.logout()
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openQuickActions() {
    // FAB já tem as ações, este método pode ser usado para analytics
    console.log('Quick actions opened');
  }

  async sendBulkMessage() {
    const alert = await this.alertCtrl.create({
      header: 'Enviar Aviso',
      message: 'Para quem você gostaria de enviar o aviso?',
      buttons: [
        {
          text: 'Todos os Membros',
          handler: () => this.navigateTo('/messages/new', { target: 'all' })
        },
        {
          text: 'Membros Ativos',
          handler: () => this.navigateTo('/messages/new', { target: 'active' })
        },
        {
          text: 'Grupo Específico',
          handler: () => this.navigateTo('/messages/new', { target: 'group' })
        }
      ]
    });

    await alert.present();
  }

  async handleActivity(activity: RecentActivity) {
    // Navegar baseado no tipo de atividade
    switch (activity.type) {
      case 'member':
        if (activity.data?.memberId) {
          this.navigateTo(`/members/${activity.data.memberId}`);
        } else {
          this.navigateTo('/members');
        }
        break;
      case 'event':
        if (activity.data?.eventId) {
          this.navigateTo(`/events/${activity.data.eventId}`);
        } else {
          this.navigateTo('/events');
        }
        break;
      case 'visitor':
        this.navigateTo('/visitors');
        break;
      default:
        console.log('Activity clicked:', activity);
    }
  }

  async viewEvent(event: UpcomingEvent) {
    this.navigateTo(`/events/${event.id}`);
  }

  /**
   * PULL TO REFRESH
   */
  async doRefresh(event: any) {
    console.log('🔄 Refreshing dashboard...');

    try {
      await this.loadDashboardData();
      await this.showToast('Dados atualizados!', 'success', 1500);
    } catch (error) {
      console.error('Erro no refresh:', error);
      await this.showToast('Erro ao atualizar', 'danger');
    } finally {
      event.target.complete();
    }
  }

  /**
   * AUTO REFRESH (opcional)
   */
  private setupAutoRefresh() {
    // Atualizar a cada 5 minutos
    this.refreshSubscription = interval(5 * 60 * 1000).subscribe(() => {
      console.log('🔄 Auto refresh...');
      this.loadStats(); // Só as stats para não ser muito pesado
    });
  }

  /**
   * SETUP DE NOTIFICAÇÕES
   */
  private setupNotifications() {
    // Simular contador de notificações
    this.notificationCount = 3;

    // Aqui você conectaria com o service real de notificações
    // this.notificationService.getUnreadCount().subscribe(count => {
    //   this.notificationCount = count;
    // });
  }

  /**
   * LOGOUT
   */
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Tem certeza que deseja sair do app?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sair',
          role: 'destructive',
          handler: () => {
            // Implementar logout
            localStorage.clear();
            this.util.navigateRoot('/welcome');
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * UTILITY METHODS
   */
  trackActivity(index: number, item: RecentActivity): string {
    return item.id;
  }

  trackEvent(index: number, item: UpcomingEvent): string {
    return item.id;
  }

  private async showToast(message: string, color: string = 'primary', duration: number = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle' :
        color === 'danger' ? 'alert-circle' :
          'information-circle'
    });
    await toast.present();
  }


  onSearch() {
    console.log('Busca clicada');
    // Implementar lógica de busca ou navegar para página de busca
    // this.router.navigate(['/search']);
  }

  // Método auxiliar para verificar crescimento (evitar erro undefined)
  getMemberGrowth(): number {
    return this.stats?.memberGrowth || 0;
  }
}
