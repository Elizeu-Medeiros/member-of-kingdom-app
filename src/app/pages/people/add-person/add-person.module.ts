import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPersonPageRoutingModule } from './add-person-routing.module';

import { AddPersonPage } from './add-person.page';
// import { PhonePipe } from 'src/app/pipes/phone.pipe';
// import { DatePipe } from 'src/app/pipes/date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPersonPageRoutingModule
  ],
  declarations: [
    AddPersonPage,
    // PhonePipe,
    // DatePipe
  ]
})
export class AddPersonPageModule { }
