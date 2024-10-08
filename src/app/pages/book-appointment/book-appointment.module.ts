
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookAppointmentPageRoutingModule } from './book-appointment-routing.module';

import { BookAppointmentPage } from './book-appointment.page';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookAppointmentPageRoutingModule
  ],
  declarations: [BookAppointmentPage]
})
export class BookAppointmentPageModule { }
