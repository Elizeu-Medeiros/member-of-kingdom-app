
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { People } from 'src/app/models/people.model';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PeopleService } from 'src/app/services/people.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.page.html',
  styleUrls: ['./list-people.page.scss'],
})
export class ListPeoplePage implements OnInit {
  selected: any = 'all';
  peopleList: People[] = [];

  imageCache: { [key: string]: string } = {};

  constructor(
    public util: UtilService,
    private firebaseStorageService: FirebaseStorageService,
    private peopleService: PeopleService
  ) { }

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople(): void {
    this.peopleService.getPeoples().subscribe({
      next: (response) => {
        this.peopleList = response; // Atribui os dados da pessoa à lista
        this.peopleList.forEach(people => {
          this.getImagemUrl(people); // Carrega e armazena a URL da imagem para cada pessoa
        });
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
        this.util.showToast('Erro ao carregar pessoas', 'danger', 'top');
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
        });
      } else {
        // Se a imagem já estiver no cache, usa o cache
        people.photoUrl = this.imageCache[photoKey];
      }
    } else {
      // Caso não tenha foto, define a imagem padrão diretamente
      people.photoUrl = this.getAvatarUrl(people);
    }
  }

  deletePeople(id: number): void {
    this.peopleService.deletePeople(id).subscribe(
      () => {
        console.log('Pesoa excluído com sucesso!');
        this.getPeople(); // Atualiza a lista de usuários após a exclusão
      },
      error => {
        console.error('Erro ao excluir o usuário:', error);
      }
    );
  }

  onPersonInfo(people: any) {
    const param: NavigationExtras = {
      queryParams: {
        people: JSON.stringify(people)  // Serializa corretamente o objeto
      }
    };
    this.util.navigateToPage('info-people', param);
  }

  getAvatarUrl(people: People): any {
  // Verifica o gênero para definir a imagem padrão
    switch (people.gender) {
      case 'm':
        return 'assets/images/avatar/avatar-man.png'; // Avatar masculino
      case 'f':
        return 'assets/images/avatar/avatar-wormen.png'; // Avatar feminino
      default:
        return 'assets/images/avatar/default-avatar.png'; // Avatar padrão
    }
  }


  // Função para abrir a página de cadastro
  openAddPersonPage() {
    this.util.navigateToPage('/add-people'); // Ajuste o caminho conforme necessário
  }


  editarPeople(people: People) {


  }


}
