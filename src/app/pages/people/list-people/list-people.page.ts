
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { People } from 'src/app/models/people.model';
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
  constructor(
    public util: UtilService,
    private peopleService: PeopleService
  ) { }

  ngOnInit(): void {
    this.getPeople();
  }

  getPeople(): void {
    this.peopleService.getPeoples().subscribe(
      (data: People[]) => {
        this.peopleList = data;
      },
      error => {
        console.error('Erro ao buscar usuários:', error);
      }
    );
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
