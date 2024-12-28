import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { People } from 'src/app/models/people.model';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { UtilService } from 'src/app/services/util.service';
import * as L from 'leaflet';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { PeopleStateService } from '../../../services/peopleState.service';

@Component({
  selector: 'app-info-people',
  templateUrl: './info-people.page.html',
  styleUrls: ['./info-people.page.scss'],
})
export class InfoPeoplePage implements OnInit {

  public selectedPerson: People | null = null;
  private readonly destroy$ = new Subject<void>();
  imageCache: { [key: string]: string } = {};

  map: L.Map | undefined;

  constructor(
    public util: UtilService,
    private readonly firebaseStorageService: FirebaseStorageService,
    private readonly geocodingService: GeocodingService,
    private readonly route: ActivatedRoute,
    private readonly peopleStateService: PeopleStateService,
  ) { }

  ngOnInit(): void {
    this.peopleStateService.selectedPerson$
      .pipe(takeUntil(this.destroy$))
      .subscribe((person) => {
        if (person) {
          this.selectedPerson = person;
          this.loadImageUrl(this.selectedPerson);
        } else {
          console.warn('Nenhuma pessoa selecionada.');
        }
      });
  }

  ionViewWillEnter(): void {
    // Atualiza os dados do estado ao retornar à página
    const updatedPerson = this.peopleStateService.selectedPerson;
    if (updatedPerson) {
      this.selectedPerson = updatedPerson;
      this.loadImageUrl(this.selectedPerson);
    } else {
      console.warn('Nenhuma pessoa encontrada no estado.');
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadImageUrl(person: People): void {
    if (person.photo) {
      this.firebaseStorageService.getImageDownloadUrl(person.photo).subscribe((url) => {
        person.photoUrl = url;
      });
    } else {
      person.photoUrl = 'assets/images/avatar/default-avatar.png';
    }
  }

  ngAfterViewInit() {
    // Inicialize o mapa após a visualização ser carregada
    // this.initMap();
  }

  initMap() {


    const map = L.map('map').setView([-22.878385, -42.351861], 13); // Coordenadas iniciais

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      // attribution: '© OpenStreetMap'
    }).addTo(map);
  }

  geocodeAndLoadMap(address: string) {
    this.geocodingService.geocodeAddress(address).subscribe((results) => {
      if (results && results.length > 0) {
        const { lat, lon } = results[0]; // Pega latitude e longitude do primeiro resultado
        this.loadMap(lat, lon);
      } else {
        console.error('Endereço não encontrado.');
      }
    });
  }

  loadMap(lat: number, lon: number) {
    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map)
      .bindPopup('Local do endereço')
      .openPopup();
  }

  ionViewDidLeave() {
    if (this.map) {
      this.map.remove();
    }
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

  onEditProfile(people: People | null): void {
    this.util.navigateToPage('/add-people');
  }

  onWhatsApp() {

  }

  onQrCode() { }

  onBack() {
    // this.util.onBack();
    this.util.navigateToPage('tabs/people');
  }

  onBook() {
    this.util.navigateToPage('book-appointment');
  }

}
