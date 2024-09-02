
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpCentrePageRoutingModule } from './help-centre-routing.module';

import { HelpCentrePage } from './help-centre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpCentrePageRoutingModule
  ],
  declarations: [HelpCentrePage]
})
export class HelpCentrePageModule { }
