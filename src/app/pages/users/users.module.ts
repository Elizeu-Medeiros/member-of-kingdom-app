import { User } from 'src/app/models/user.model';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './list/users.page';
import { UserFormPage } from './form/user-form.page';
import { UserInfoPage } from './info/user-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule
  ],
  declarations: [UsersPage, UserFormPage, UserInfoPage]
})
export class UsersPageModule { }
