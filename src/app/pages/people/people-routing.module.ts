
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeopleListPage } from './list/people-list.page';
import { PeopleFormPage } from './form/people-form.page';
import { PeopleInfoPage } from './info/people-info.page';

const routes: Routes = [
  { path: '', component: PeopleListPage },
  { path: 'form', component: PeopleFormPage },
  { path: 'info', component: PeopleInfoPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeoplePageRoutingModule { }
