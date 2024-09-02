import { Observable } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { TokenService } from './../../services/token.service';

import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  constructor(
    public util: UtilService,
    private tokenService: TokenService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();
  }

  onPage(name: any) {
    this.util.navigateToPage(name);
  }

  // Método para fazer logout
  onSignOut(): void {
    const logout$: Observable<any> = this.authService.signOut();

    logout$.subscribe({
      next: () => {
        this.onPage('/login'); // Redireciona para a página de login
      },
      error: (err) => {
        console.error('Erro ao tentar fazer logout', err); // Tratamento de erro
      }
    });
  }
}
