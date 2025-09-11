

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, InfiniteScrollCustomEvent, IonContent, ToastController } from '@ionic/angular';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { LaravelLink } from 'src/app/models/util.model';
import { UtilService } from 'src/app/services/util.service';
import { HttpErrorResponse } from '@angular/common/http';
import { People } from 'src/app/models/people.model';
import { PeopleService } from 'src/app/services/people.service';

export interface ApiResponse<T> { message?: string; data: T; }
@Component({
  selector: 'app-people',
  templateUrl: './people-list.page.html',
  styleUrls: ['./people-list.page.scss'],
})
export class PeopleListPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @ViewChild('sentinel', { static: true }) sentinel!: ElementRef<HTMLDivElement>;

  active: any = 'upcoming';
  currentPage = 1;

  peoples: People[] = [];          // lista exibida
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


  private readonly autoPrefetchMax = 1; // mude para 2 se quiser
  private io?: IntersectionObserver;
  // opcional: limite um “prefetch” automático se a tela for muito alta
  private prefetchTries = 0;
  private readonly prefetchMax = 1;


  constructor(
    public util: UtilService,
    private peopleService: PeopleService,
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
    // this.loadPeoples();
    // this.loadPage(1, false);
    // this.isIOS = this.util.isIos();
    // sessionStorage.removeItem('people_dirty');
    this.refreshIfDirty();
  }

  private async refreshIfDirty() {
    if (sessionStorage.getItem('people_dirty') === '1') {
      sessionStorage.removeItem('people_dirty');

      // opcional: sobe pro topo antes de recarregar
      this.content?.scrollToTop(0);

      // sua função que zera e busca página 1
      this.resetAndLoad();

      // se você quiser mostrar uma msg passada via history.state.toast:
      const msg = history.state?.toast;
      if (msg) (await this.toastCtrl.create({ message: msg, duration: 1500 })).present();
    }
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
          this.loadPage(this.page + 1, true);
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
    this.peoples = [];
    this.page = 1;
    this.lastPage = 1;
    this.hasMore = true;
    this.prefetchTries = 0;
    this.loadPage(1, false);
    this.page = 1;
  }

  loadPage(n: number, ev?: any) {
    if (this.loading) { ev?.target?.complete?.(); return; }
    this.loading = true;
    const q = this.searchTerm.trim();

    this.peopleService.getPeoplesPage(n, q, this.perPage).subscribe({
      next: (res) => {
        const p = res.data;               // paginator
        const items = p?.data ?? [];      // <<--- AQUI está a lista
        this.peoples = n === 1 ? items : [...this.peoples, ...items];
        this.page = p.current_page;
        this.hasMore = p.current_page < p.last_page; // op: !!p.next_page_url
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
        this.errorMsg = e.error?.message || 'Falha ao carregar pessoas.';
      },
      complete: () => {
        this.loading = false;
        ev?.target?.complete?.(); // completa o infinite scroll se houver
      }
    });
  }


  onLoadMore(ev: any) {
    if (!this.hasMore) { ev.target.complete(); return; }
    this.loadPage(this.page + 1, ev);
  }


  private async maybePrefetchIfNoScroll() {
    if (!this.hasMore || this.loadingMore) return;
    if (this.prefetchTries >= this.prefetchMax) return;

    const el = await this.content.getScrollElement();
    const canScroll = (el.scrollHeight - el.clientHeight) > 80;
    if (!canScroll) {
      this.prefetchTries++;
      this.loadPage(this.page + 1, true);
    }
  }

  onRefresh(ev: Event | CustomEvent) {
    this.resetAndLoad();
    (ev.target as HTMLIonRefresherElement | null)?.complete?.();
  }



  trackById(_i: number, p: People) { return p.id; }

  // Dispara nova página automaticamente se a lista ainda não gerar scroll
  private async autoLoadIfNotScrollable() {
    if (!this.hasMore || this.loadingMore) return;

    const el = await this.content.getScrollElement();
    const thresholdPx = 120; // mesmo do infinite
    const canScroll = (el.scrollHeight - el.clientHeight) > thresholdPx;

    if (!canScroll) {
      // ainda não tem scroll suficiente; puxa a próxima página
      this.loadPage(this.page + 1, true);
    }
  }

  getInitials(name = ''): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || '').concat(parts[1]?.[0] || '').toUpperCase();
  }

  async confirmDelete(p: People) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir pessoa',
      message: `Tem certeza que deseja excluir <b>${p.name_full}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        // { text: 'Excluir', role: 'destructive', handler: () => this.delete(u) }
      ]
    });
    await alert.present();
  }

  onCreate() {
    this.router.navigate(['form'], { relativeTo: this.route, state: { mode: 'create' } });
  }

  onEdit(p: People) {
    // guarda para sobreviver a F5
    sessionStorage.setItem('people_edit', JSON.stringify(p));

    // navega SEM id, levando o objeto no state
    this.router.navigate(['form'], {
      relativeTo: this.route,
      state: { people: p }
    });
  }

  onInfo(p: People) {
    // guarda para sobreviver a F5
    sessionStorage.setItem('people_info', JSON.stringify(p));

    // navega SEM id, levando o objeto no state
    this.router.navigate(['info'], {
      relativeTo: this.route,
      state: { people: p }
    });
  }

  async onDelete(p: People) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir pessoa',
      message: `Deseja excluir ${p.name_full}?`, // use <strong>, não <b>
      cssClass: 'confirm-alert', // para garantir o negrito
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.deletePeople(p)
        }
      ]
    });
    await alert.present();
  }


  private deletePeople(p: People) {
    this.loading = true;
    this.peopleService.deletePeople(p.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: async () => {
          this.peoples = this.peoples.filter(x => x.id !== p.id);
          sessionStorage.setItem('people_dirty', '1');
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
    this.resetAndLoad();
  }

  onSearchInput(ev: any) {
    this.searchTerm = (ev?.detail?.value || '').toString();
    this.resetAndLoad();
  }
  onSearchCleared() {
    this.searchTerm = '';
    this.resetAndLoad();
  }

  onPersonInfo(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('doctor-info', param);
  }

  getAvatarUrl(person: People): any {
    if (!person.photo) {
      // Verifica o gênero para definir a imagem padrão
      switch (person.gender) {
        case 'm':
          return 'assets/images/avatar/avatar-man.png'; // Avatar masculino
        case 'f':
          return 'assets/images/avatar/avatar-wormen.png'; // Avatar feminino
      }
    } else {
      return person.photo; // Retorna a URL da foto se houver uma
    }
  }


}
