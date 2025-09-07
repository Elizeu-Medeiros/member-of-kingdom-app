
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { People } from 'src/app/models/people.model';
import { User } from 'src/app/models/user.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {
  user: User | null = null;
  constructor(
    public util: UtilService,
    private router: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit(): void {
    // 1) tenta recuperar da navegação
    const fromNav = (window.history.state as any)?.user as User | undefined;
    if (fromNav) {
      this.user = fromNav;
      sessionStorage.setItem('user_info', JSON.stringify(fromNav));
      return;
    }
    // 2) fallback: sessionStorage
    const cached = sessionStorage.getItem('user_info');
    if (cached) {
      try { this.user = JSON.parse(cached) as User; } catch { this.user = null; }
    }
  }

  onBack(): void {
    // volta uma tela; se não houver histórico, cai para rota da lista
    try { this.navCtrl.back(); } catch { /* noop */ }
    // fallback após um tick
    setTimeout(() => {
      if (!document.referrer) {
        this.router.navigate(['/tabs', 'users']);
      }
    }, 0);
  }

  async onBook(): Promise<void> {
    // exemplo: apenas um toast (troque pela navegação desejada)
    const t = await this.toastCtrl.create({
      message: 'Ação de agendamento (exemplo).',
      duration: 1500,
      position: 'top',
      color: 'primary',
      icon: 'calendar',
    });
    await t.present();
  }

  getAvatarUrl(person: People): any {
    if (!person.photo) {
      // Verifica o gênero para definir a imagem padrão
      switch (person.gender) {
        case 'm':
          return 'assets/images/avatar/avatar-man.png'; // Avatar masculino
        case 'f':
          return 'assets/images/avatar/avatar-wormen.png'; // Avatar feminino
        default:
          return 'assets/images/avatar/avatar.png';
      }
    } else {
      return person.photo; // Retorna a URL da foto se houver uma
    }
  }

  // (opcional) limpar ao sair, se não quiser manter cache
  ionViewWillLeave() {
    // sessionStorage.removeItem('user_info');
  }
}
