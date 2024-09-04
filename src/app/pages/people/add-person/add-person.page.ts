
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
})
export class AddPersonPage implements OnInit {

  newPerson = {
    name: '',
    cellPhone: '',
    birthDate: ''
  };

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  onSubmit() {
    // Lógica para salvar a nova pessoa
    console.log('Pessoa adicionada:', this.newPerson);
    // this.router.navigate(['/']); // Navega de volta para a lista de pessoas
  }

}
