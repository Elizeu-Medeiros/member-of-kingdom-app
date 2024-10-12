import { People } from 'src/app/models/people.model';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    uuid_people: '',
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

  imageUrl: string | undefined;
  imagemFileName: string | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
      member_id: [''],
      church_id: [''],
      cell_phone: ['', [Validators.pattern('^[0-9]{10,11}$')]],
      gender: [''],
      birth_date: [''],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.getTypePerson();
    this.getChurches();

    // Faz o download da imagem e obtém a URL
    // this.firebaseStorageService.getImageDownloadUrl('images/1728324924333_image.jpg')
    //   .subscribe(url => {
    //     this.imageUrl = url;  // Armazena a URL da imagem no componente
    //     // console.log('URL da Imagem:', this.imageUrl);
    //   });

    // Recupera os dados da pessoa enviados pela rota
    this.route.queryParams.subscribe(params => {
      if (params['people']) {
        try {
          this.people = typeof params['people'] === 'string' ? JSON.parse(params['people']) : params['people'];
          this.populateForm(this.people);
          if (this.people.photo) {
            this.getImageUrl(this.people.photo);
          }
        } catch (error) {
          console.error('Erro ao fazer o parse do JSON:', error);
        }
      }
    });

  }

  // Método para preencher o formulário com os dados da pessoa
  populateForm(people: People) {
    if (people) {
      this.addPersonForm.patchValue({
        uuid_people: people.uuid_people,
        name_full: people.name_full,
        type_people_id: people.type_people?.uuid_type_people,
        member_id: people.member?.uuid_member,
        church_id: people.member?.church?.uuid_church,
        cell_phone: people.cell_phone,
        birth_date: people.birth_date,
        gender: people.gender,
        photo: people.photo,
      });
    }
  }

  // Método para enviar o formulário
  onSubmit() {
    if (this.addPersonForm.valid) {
      const formData = this.addPersonForm.value;

      this.addPersonForm.patchValue({
        photo: this.imagemFileName,
      });

      if (this.people && this.people.uuid_people) {
        // Se houver um ID, é uma atualização
        this.peopleService.updatePeople(this.people.uuid_people, formData).subscribe(
          response => {
            this.util.showToast('Pessoa atualizada com sucesso!', 'success', 'bottom');
            this.util.navigateToPage('/list-people');
          },
          error => {
            this.util.showToast('Erro ao atualizar pessoa', 'danger', 'top');
          }
        );
      } else {
        // Caso contrário, é uma criação
        this.peopleService.createPeople(formData).subscribe(
          response => {
            this.util.showToast('Pessoa criada com sucesso!', 'success', 'bottom');
            this.util.navigateToPage('/lis-people');
            // this.onBack();
          },
          error => {
            this.util.showToast('Erro ao criar pessoa', 'danger', 'top');
          }
        );
      }
    } else {
      this.util.showToast('Por favor, preencha todos os campos obrigatórios', 'danger', 'top');
    }
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

      this.addPersonForm.patchValue({
        photo: fileName,
      });
      // Faz o upload da imagem e obtém a URL
      this.firebaseStorageService.uploadImage(fileName, new File([blob], fileName))
        .subscribe(url => {
          this.imageUrl = url;  // Armazena a URL da imagem no componente
          // console.log('URL da Imagem:', this.imageUrl);
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

    this.addPersonForm.patchValue({
      photo: fileName,
    });

    this.firebaseStorageService.uploadImage(fileName, new File([blob], fileName))
      .subscribe(url => {
        this.imageUrl = url; // Armazena a URL da imagem
        // this.addPersonForm.patchValue({ photo: url }); // Atualiza o campo 'photo' com a URL no formulário
        console.log('URL da imagem salva no formulário:', url);
      });
  }

  getImageUrl(imagemUrl: string) {
    this.imagemFileName = imagemUrl;
    // Faz o download da imagem e obtém a URL
    this.firebaseStorageService.getImageDownloadUrl(imagemUrl)
      .subscribe(url => {
        this.imageUrl = url;  // Armazena a URL da imagem no componente
        // console.log('URL da Imagem:', this.imageUrl);
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
        // console.log('Igrejas carregadas com sucesso:', this.churchesList);
      },
      error: (error) => {
        console.error('Erro ao carregar igrejas:', error);
        this.util.showToast('Erro ao carregar igrejas', 'danger', 'top');
      }
    });
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
