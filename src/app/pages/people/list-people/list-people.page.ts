import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { People } from 'src/app/models/people.model';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PeopleService } from 'src/app/services/people.service';
import { UtilService } from 'src/app/services/util.service';
import { PeopleStateService } from '../../../services/peopleState.service';

@Component({
  selector: 'app-list-people',
  templateUrl: './list-people.page.html',
  styleUrls: ['./list-people.page.scss'],
})
export class ListPeoplePage implements OnInit {
  selected: any = 'all';
  peopleList: People[] = [];

  imageCache: { [key: string]: string } = {};

  currentPage: number = 1;
  itemsPerPage: number = 5;
  hasMorePeople: boolean = true;
  currentSearch = '';
  loadingPeople: boolean = false; // Evita múltiplas requisições simultâneas

  constructor(
    public util: UtilService,
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly peopleService: PeopleService,
    private readonly peopleStateService: PeopleStateService,
  ) { }

  ngOnInit(): void {
    this.getPeople();
  }

  ionViewWillEnter(): void {
    this.getPeople(true);
  }

  ionViewDidEnter(): void {
    console.log('ionViewDidEnter chamado - atualizando lista de pessoas');
    this.getPeople(true);
  }

  getPeople(reset = false): void {
    if (reset) {
      this.currentPage = 1; // Reseta a paginação se for uma nova busca
      this.peopleList = [];
      this.hasMorePeople = true; // Habilita o carregamento de mais pessoas novamente
    }

    if (!this.hasMorePeople || this.loadingPeople) return; // Se não há mais pessoas ou já está carregando, não faz nada

    this.loadingPeople = true; // Marca que está carregando

    this.peopleService.getPeoples(this.currentPage, this.itemsPerPage, this.currentSearch).subscribe({
      next: (response: People[]) => {
        if (response.length < this.itemsPerPage) {
          this.hasMorePeople = false; // Se o número de pessoas retornado for menor que o limite, não há mais para carregar
        }
        this.peopleList = [...this.peopleList, ...response]; // Adiciona os novos dados
        this.peopleList.forEach((people) => this.getImagemUrl(people)); // Carrega as imagens
        this.currentPage++;
        this.loadingPeople = false; // Desmarca o carregamento
      },
      error: (error) => {
        console.error('Erro ao buscar usuários:', error);
        this.util.showToast('Erro ao carregar pessoas', 'danger', 'top');
        this.loadingPeople = false; // Desmarca o carregamento mesmo com erro
      },
    });
  }
  onSearch(event: any): void {
    const searchTerm = event.target.value;
    this.currentSearch = searchTerm.trim();
    this.getPeople(true);  // Reinicia a busca e carrega a primeira página
  }

  // Carrega mais pessoas quando o usuário rolar a página
  loadMorePeople(event: any): void {
    if (!this.hasMorePeople || this.loadingPeople) {
      event.target.complete(); // Finaliza o evento de scroll
      return;
    }
    this.getPeople();
    event.target.complete(); // Finaliza o evento de scroll
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
    this.peopleService.deletePeople(id).subscribe({
      next: () => {
        console.log('Pessoa excluída com sucesso!');
        this.getPeople(true); // Atualiza a lista de usuários após a exclusão
      },
      error: (error) => {
        console.error('Erro ao excluir o usuário:', error);
      }
    });
  }

  onPersonInfo(people: any) {
    console.info("setSelectedPerson :", people);
    this.peopleStateService.setSelectedPerson(people);
    this.util.navigateToPage('info-people');
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
    this.peopleStateService.clearSelectedPerson();
    this.util.navigateToPage('/add-people'); // Ajuste o caminho conforme necessário
  }

  editarPeople(people: People) {
    // Função para edição de pessoas
  }
}
