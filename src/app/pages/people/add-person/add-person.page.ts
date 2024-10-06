import { People } from 'src/app/models/people.model';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Churches } from 'src/app/models/churches.model';
import { ChurchesService } from 'src/app/services/churches.service';
import { TypePerson } from 'src/app/models/type-person.model';
import { TypePersonService } from 'src/app/services/type-person.service';
import { UtilService } from 'src/app/services/util.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PeopleService } from 'src/app/services/people.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {

  addPersonForm: FormGroup;

  people: People = {
    name_full: '',
    type_people_id: '',
    user_id: '',
    document: '',
    phone: '',
    cell_phone: '',
    photo: '',
    birth_date: '',
    gender: '',
    church_id: '',
  };

  typePeopleList: Array<TypePerson> = [];
  selectedTypePerson?: TypePerson;

  churchesList: Churches[] = [];  // Lista de igrejas
  selectedChurches?: Churches;

  selectedFile?: File;
  selectedImage: string | undefined;

  constructor(
    private router: Router,
    private typePersonService: TypePersonService,
    private churchesService: ChurchesService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    public util: UtilService
  ) {
    this.addPersonForm = this.fb.group({
      name_full: ['', [Validators.required]],
      type_people_id: ['', [Validators.required]],
      church_id: [''],
      cell_phone: ['', [Validators.pattern('^[0-9]{10,11}$')]],
      gender: [''],
      birth_date: ['']
    });
  }

  ngOnInit(): void {
    this.getTypePerson();
    this.getChurches();
  }

  // Método para capturar a foto usando a câmera
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Use Uri para obter uma URL da imagem
      source: CameraSource.Camera, // Usar a câmera
    });

    this.selectedImage = image.webPath; // Salvar a URL da imagem para exibi-la
    this.people.photo = image.webPath; // Salvar a imagem no objeto 'people'
  }

  // Método para carregar os tipos de pessoa
  getTypePerson() {
    this.typePersonService.getTypePersons().subscribe({
      next: (data: TypePerson[]) => {
        this.typePeopleList = data;
      },
      error: (error) => {
        console.error('Erro ao carregar tipos de pessoa', error);
      }
    });
  }

  // Método para carregar as igrejas
  getChurches(): void {
    this.churchesService.getChurches().subscribe({
      next: (churches: Churches[]) => {
        this.churchesList = churches;
        console.log('Igrejas carregadas com sucesso:', this.churchesList);
      },
      error: (error) => {
        console.error('Erro ao carregar igrejas:', error);
        this.util.showToast('Erro ao carregar igrejas', 'danger', 'top');
      }
    });
  }


  // Função para enviar o formulário
  onSubmit() {

    if (this.addPersonForm.valid) {
      const formData: People = this.addPersonForm.value;
      console.log("Form data => ", formData);
      this.peopleService.createPeople(formData).subscribe(
        (response) => {
          this.util.showToast('Pessoa criada com sucesso!', 'success', 'bottom');
          this.router.navigate(['/tabs/people']);
        },
        (error) => {
          console.error('Erro ao criar pessoa:', error);
          this.util.showToast('Erro ao tentar cadastrar pessoa', 'danger', 'top');
        }
      );
    } else {
      this.util.showToast('Por favor, preencha todos os campos obrigatórios', 'danger', 'top');
    }
  }

  // Método para verificar se o formulário é válido
  isValidForm(): boolean {
    return this.people.name_full !== '' && this.people.type_people_id !== '' && this.people.church_id !== '';
  }

  // Mudança no tipo de pessoa
  onTypePersonChange(event: any): void {
    this.people.type_people_id = event.detail.value;
  }

  // Mudança na igreja
  onChurchChange(event: any): void {
    this.people.church_id = event.detail.value;
  }

  onBack() {
    this.util.onBack();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Armazena o arquivo selecionado
  }
}
