
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoPeoplePage } from './info-people.page';

const routes: Routes = [
  {
    path: '',
    component: InfoPeoplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoPeoplePageRoutingModule { }
