
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPeoplePage } from './list-people.page';

const routes: Routes = [
  {
    path: '',
    component: ListPeoplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPeoplePageRoutingModule { }
