
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPeoplePageRoutingModule } from './info-people-routing.module';

import { InfoPeoplePage } from './info-people.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPeoplePageRoutingModule
  ],
  declarations: [InfoPeoplePage]
})
export class InfoPeoplePageModule { }
