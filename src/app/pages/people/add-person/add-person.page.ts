
import { People } from 'src/app/models/people.model';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Churches } from 'src/app/models/churches.model';
import { ChurchesService } from 'src/app/services/churches.service';
import { TypePerson } from 'src/app/models/type-person.model';
import { TypePersonService } from 'src/app/services/type-person.service';


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {

  people: People = {
    name_full: '',
    type_person_id: '',
    user_id: '',
    document: '',
    phone: '',
    cell_phone: '',
    photo: '',
    birth_date: '',
    gender: ''
  };

  typePeopleList: Array<TypePerson> = [];
  selectedTypePerson?: TypePerson;

  churchesList: Array<Churches> = [];
  selectedChurches?: Churches;

  selectedFile?: File;

  constructor(
    private router: Router,
    private typePersonService: TypePersonService,
    private churchesService: ChurchesService,
  ) { }

  ngOnInit(): void {
    this.getTypePerson();

    this.getChurches();

  }

  getTypePerson() {
    this.typePersonService.getTypePersons().subscribe({
      next: (data: TypePerson[]) => {
        this.typePeopleList = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de pessoa', error);
      },
      complete: () => {
        console.log('Consulta de tipos de pessoa concluída');
      }
    });
  }

  getChurches() {
    this.churchesService.getChurches().subscribe({
      next: (data: Churches[]) => {
        this.churchesList = data;
      },
      error: (error) => {
        console.error('Erro ao carregar igrejas', error);
      },
      complete: () => {
        console.log('Consulta de igrejas concluída');
      }
    });
  }

  onSubmit() {
    // Lógica para salvar a nova pessoa
    console.log('Pessoa adicionada:', this.people);
    // this.router.navigate(['/']); // Navega de volta para a lista de pessoas
  }

  onTypePersonChange(event: any): void {
    this.selectedTypePerson = event.detail.value;
    console.log('Tipo de pessoa selecionado:', this.selectedTypePerson);
  }

  async openAddTypePersonModal() {
    // const modal = await this.modalController.create({
    //   component: AddTypePersonModalComponent
    // });

    // modal.onDidDismiss().then((result) => {
    //   if (result.data && result.data.newTypePerson) {
    //     this.loadTypePeople(); // Atualiza a lista após adicionar um novo tipo
    //   }
    // });

    // return await modal.present();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Armazena o arquivo selecionado
  }

}
