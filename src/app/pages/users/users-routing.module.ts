
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './list/users.page';
import { UserFormPage } from './form/user-form.page';

const routes: Routes = [
  { path: '', component: UsersPage },
  { path: 'form', component: UserFormPage },    // /tabs/users/details  (modo criar)
  // { path: 'details/:id', component: UserFormPage } // /tabs/users/details/123 (modo editar)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule { }
