
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './list/users.page';
import { UserFormPage } from './form/user-form.page';
import { UserInfoPage } from './info/user-info.page';

const routes: Routes = [
  { path: '', component: UsersPage },
  { path: 'form', component: UserFormPage },    // /tabs/users/details  (modo criar)
  { path: 'info', component: UserInfoPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule { }
