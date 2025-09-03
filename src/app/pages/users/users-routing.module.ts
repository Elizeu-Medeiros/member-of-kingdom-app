
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './list/users.page';
import { UserDetailsPage } from './details/user-details.page';

const routes: Routes = [
  { path: '', component: UsersPage },
  { path: 'details', component: UserDetailsPage },    // /tabs/users/details  (modo criar)
  // { path: 'details/:id', component: UserDetailsPage } // /tabs/users/details/123 (modo editar)
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule { }
