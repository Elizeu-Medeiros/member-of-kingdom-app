
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPessoasPageRoutingModule } from './list-pessoas-routing.module';

import { ListPessoasPage } from './list-pessoas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPessoasPageRoutingModule
  ],
  declarations: [ListPessoasPage]
})
export class ListPessoasPageModule { }
