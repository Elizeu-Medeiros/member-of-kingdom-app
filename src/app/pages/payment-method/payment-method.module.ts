/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentMethodPageRoutingModule } from './payment-method-routing.module';

import { PaymentMethodPage } from './payment-method.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentMethodPageRoutingModule
  ],
  declarations: [PaymentMethodPage]
})
export class PaymentMethodPageModule { }
