
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeoplePageRoutingModule } from './people-routing.module';

import { PeopleListPage } from './list/people-list.page';
import { PhonePipe } from 'src/app/pipes/phone.pipe';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { PeopleFormPage } from './form/people-form.page';
import { PeopleInfoPage } from './info/people-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeoplePageRoutingModule
  ],
  declarations: [
    PeopleListPage,
    PeopleFormPage,
    PeopleInfoPage,
    PhonePipe,
    DatePipe
  ]
})
export class PeoplePageModule { }
