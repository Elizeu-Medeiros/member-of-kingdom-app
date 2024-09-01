
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Pessoa } from 'src/app/models/pessoa.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-list-pessoas',
  templateUrl: './list-pessoas.page.html',
  styleUrls: ['./list-pessoas.page.scss'],
})
export class ListPessoasPage implements OnInit {
  selected: any = 'all';
  constructor(
    public util: UtilService
    private pessoasService: PessoaService
  ) { }

  ngOnInit() {
  }

  onDoctorInfo(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('doctor-info', param);
  }

}
