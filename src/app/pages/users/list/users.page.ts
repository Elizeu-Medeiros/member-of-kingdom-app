
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, IonContent, ToastController } from '@ionic/angular';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { LaravelLink, Paginated } from 'src/app/models/util.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @ViewChild('sentinel', { static: true }) sentinel!: ElementRef<HTMLDivElement>;

  active: any = 'upcoming';
  currentPage = 1;

  users: User[] = [];          // lista exibida
  page = 0;                    // página atual
  lastPage = 1;                // última página do back
  hasMore = true;              // controla infinite
  loading = false;             // loading inicial/refresh
  loadingMore = false;         // loading do infinite
  errorMsg = '';
  isIOS = false;
  skeletons = Array.from({ length: 5 });
  // filtros
  searchTerm = '';
  perPage = 10;           // seu caso de teste

  // >>> NOVO: controle de auto-fill (só 1 ou 2 tentativas)
  private autoPrefetchTries = 0;
  private readonly autoPrefetchMax = 1; // mude para 2 se quiser
  private io?: IntersectionObserver;
  // opcional: limite um “prefetch” automático se a tela for muito alta
  private prefetchTries = 0;
  private readonly prefetchMax = 1;


  constructor(
    public util: UtilService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.resetAndLoad();
    this.setupObserver();
  }

  ionViewWillEnter() {
    // Se quiser recarregar sempre que voltar para a aba:
    // this.loadUsers();
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }

  // Configura o IntersectionObserver ancorado no scroll do IonContent
  private async setupObserver() {
    const rootEl = await this.content.getScrollElement();
    this.io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting && this.hasMore && !this.loadingMore && !this.loading) {
          this.fetchPage(this.page + 1, true);
        }
      },
      {
        root: rootEl,
        rootMargin: '0px 0px 200px 0px', // “antecipa” 200px antes do rodapé
        threshold: 0.01,
      }
    );
    this.io.observe(this.sentinel.nativeElement);
  }

  resetAndLoad(search = this.searchTerm) {
    this.users = [];
    this.page = 1;
    this.lastPage = 1;
    this.hasMore = true;
    this.prefetchTries = 0;
    this.fetchPage(1, false, search);
  }

  private fetchPage(n: number, append = false, search = this.searchTerm) {
    if (append) this.loadingMore = true; else this.loading = true;

    this.userService.getUsersPage(n, search, this.perPage)
      .pipe(finalize(() => { this.loading = false; this.loadingMore = false; }))
      .subscribe({
        next: (p: Paginated<User>) => {
          const batch = p.data ?? [];
          this.page = p.current_page;
          this.lastPage = p.last_page ?? this.lastPage;
          this.users = append ? [...this.users, ...batch] : batch;
          this.hasMore = !!p.next_page_url || (this.page < (p.last_page ?? this.lastPage));

          // Prefetch limitado se ainda não houver área de scroll
          setTimeout(() => this.maybePrefetchIfNoScroll(), 0);
        },
        error: async (e) => {
          console.error(e);
          this.hasMore = false;
          (await this.toastCtrl.create({ message: 'Erro ao carregar', color: 'danger', duration: 2000 })).present();
        }
      });
  }

  private async maybePrefetchIfNoScroll() {
    if (!this.hasMore || this.loadingMore) return;
    if (this.prefetchTries >= this.prefetchMax) return;

    const el = await this.content.getScrollElement();
    const canScroll = (el.scrollHeight - el.clientHeight) > 80;
    if (!canScroll) {
      this.prefetchTries++;
      this.fetchPage(this.page + 1, true, this.searchTerm);
    }
  }

  onRefresh(ev: Event | CustomEvent) {
    this.resetAndLoad();
    (ev.target as HTMLIonRefresherElement | null)?.complete?.();
  }



  trackById(_i: number, u: User) { return u.id; }

  // Dispara nova página automaticamente se a lista ainda não gerar scroll
  private async autoLoadIfNotScrollable() {
    if (!this.hasMore || this.loadingMore) return;

    const el = await this.content.getScrollElement();
    const thresholdPx = 120; // mesmo do infinite
    const canScroll = (el.scrollHeight - el.clientHeight) > thresholdPx;

    if (!canScroll) {
      // ainda não tem scroll suficiente; puxa a próxima página
      this.fetchPage(this.page + 1, true, this.searchTerm);
    }
  }

  getInitials(name = ''): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || '').concat(parts[1]?.[0] || '').toUpperCase();
  }

  goToDetails(u: User) {
    this.router.navigate(['/tabs', 'users', 'details', u.id]);
  }
  async confirmDelete(u: User) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir usuário',
      message: `Tem certeza que deseja excluir <b>${u.name}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        // { text: 'Excluir', role: 'destructive', handler: () => this.delete(u) }
      ]
    });
    await alert.present();
  }

  onCreate() {
    this.router.navigate(['details'], { relativeTo: this.route, state: { mode: 'create' } });
  }

  onEdit(u: User) {
    // guarda para sobreviver a F5
    sessionStorage.setItem('user_edit', JSON.stringify(u));

    // navega SEM id, levando o objeto no state
    this.router.navigate(['details'], {
      relativeTo: this.route,
      state: { user: u }
    });
  }

  async onDelete(u: User) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir usuário',
      message: `Deseja excluir <b>${u.name}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive',
          handler: () => this.deleteUser(u)
        }
      ]
    });
    await alert.present();
  }

  private deleteUser(u: User) {
    this.loading = true;
    this.userService.deleteUser(u.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: async () => {
          this.users = this.users.filter(x => x.id !== u.id);
          (await this.toastCtrl.create({ message: 'Usuário excluído', duration: 1500 })).present();
        },
        error: async (err) => {
          console.error(err);
          (await this.toastCtrl.create({ message: 'Erro ao excluir', duration: 2000, color: 'danger' })).present();
        }
      });
  }

  onSearch(ev: any) {
    this.searchTerm = (ev.target?.value || '').trim();
    this.resetAndLoad(); // já refaz a paginação com search
  }


  onSearchCleared() {
    this.searchTerm = '';
    this.resetAndLoad();
  }

}
