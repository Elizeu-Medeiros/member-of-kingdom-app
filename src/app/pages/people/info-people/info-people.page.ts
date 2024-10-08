
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { People } from 'src/app/models/people.model';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-info-people',
  templateUrl: './info-people.page.html',
  styleUrls: ['./info-people.page.scss'],
})
export class InfoPeoplePage implements OnInit {

  public people: any;
  imageCache: { [key: string]: string } = {};

  constructor(
    public util: UtilService,
    private firebaseStorageService: FirebaseStorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['people']) {
        try {
          // Certifica-se de que o valor seja uma string JSON antes de fazer o parse
          this.people = typeof params['people'] === 'string' ? JSON.parse(params['people']) : params['people'];
          console.log(this.people);  // Verifica se o objeto 'people' foi recuperado corretamente

          // Depois de carregar o objeto 'people', obter a URL da imagem
          this.getImagemUrl(this.people);

        } catch (error) {
          console.error('Erro ao fazer o parse do JSON:', error);
        }
      }
    });
  }



  // Método para obter a URL da imagem com cache
  getImagemUrl(people: People): void {
    // Verifica se o people e people.photo são válidos
    if (people && people.photo) {
      const photoKey = people.photo || 'default'; // Define uma chave segura

      // Se a imagem não estiver no cache, faz a requisição
      if (!this.imageCache[photoKey]) {
        this.firebaseStorageService.getImageDownloadUrl(people.photo).subscribe(url => {
          this.imageCache[photoKey] = url; // Armazena a URL no cache com chave segura
          people.photoUrl = url; // Armazena a URL no objeto da pessoa
          console.log('Photo URL', people.photoUrl);
        });
      } else {
        // Se a imagem já estiver no cache, usa o cache
        people.photoUrl = this.imageCache[photoKey];
        console.log('Photo URL', people.photoUrl);
      }
    } else {
      // Caso não tenha foto, define a imagem padrão diretamente
      people.photoUrl = 'assets/images/avatar/default-avatar.png';
      console.log('Photo URL', people.photoUrl);
    }
  }

  onBack() {
    this.util.onBack();
  }

  onBook() {
    this.util.navigateToPage('book-appointment');
  }

}
