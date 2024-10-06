
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPeoplePageRoutingModule } from './list-people-routing.module';

import { ListPeoplePage } from './list-people.page';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { DatePipe } from 'src/app/pipes/date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPeoplePageRoutingModule
  ],
  declarations: [
    ListPeoplePage,
    PhonePipe,
    DatePipe
  ]
})
export class ListPeoplePageModule { }
