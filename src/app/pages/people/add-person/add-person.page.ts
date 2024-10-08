import { People } from 'src/app/models/people.model';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Churches } from 'src/app/models/churches.model';
import { ChurchesService } from 'src/app/services/churches.service';
import { TypePeople } from 'src/app/models/typePeople.model';
import { TypePeopleService } from 'src/app/services/type-perople.service';
import { UtilService } from 'src/app/services/util.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { PeopleService } from 'src/app/services/people.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';


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

  typePeopleList: Array<TypePeople> = [];
  selectedTypePerson?: TypePeople;

  churchesList: Churches[] = [];  // Lista de igrejas
  selectedChurches?: Churches;

  selectedFile?: File;
  selectedImage: string | undefined;

  imageUrl: string;

  constructor(
    private router: Router,
    private typePeopleService: TypePeopleService,
    private churchesService: ChurchesService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    public util: UtilService,
    private firebaseStorageService: FirebaseStorageService
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

    // Faz o download da imagem e obtém a URL
    this.firebaseStorageService.getImageDownloadUrl('images/1728324924333_image.jpg')
      .subscribe(url => {
        this.imageUrl = url;  // Armazena a URL da imagem no componente
        console.log('URL da Imagem:', this.imageUrl);
      });

  }

  async captureAndUpload() {
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    if (image.webPath) {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const fileName = `images/${new Date().getTime()}_image.jpg`;

      // Faz o upload da imagem e obtém a URL
      this.firebaseStorageService.uploadImage(fileName, new File([blob], fileName))
        .subscribe(url => {
          this.imageUrl = url;  // Armazena a URL da imagem no componente
          console.log('URL da Imagem:', this.imageUrl);
        });
    }
  }

  // Método para capturar foto usando a câmera
  async capturePhoto() {
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera, // Usar câmera
    });

    if (image.webPath) {
      this.uploadImage(image.webPath);
    }
  }

  // Método para selecionar imagem da galeria
  async selectFromGallery() {
    const image: Photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos, // Usar galeria de fotos
    });

    if (image.webPath) {
      this.uploadImage(image.webPath);
    }
  }

  // Método de upload genérico
  async uploadImage(imagePath: string) {
    const response = await fetch(imagePath);
    const blob = await response.blob();

    const fileName = `images/${new Date().getTime()}_image.jpg`;
    this.firebaseStorageService.uploadImage(fileName, new File([blob], fileName))
      .subscribe(url => {
        this.imageUrl = url; // Armazena a URL da imagem
      });
  }


  // Método para carregar os tipos de pessoa
  getTypePerson() {
    this.typePeopleService.getTypePeoples().subscribe({
      next: (data: TypePeople[]) => {
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
