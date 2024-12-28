import { ListPeoplePage } from '../people/list-people/list-people.page';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'categories',
            loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: 'search',
            loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'doctor-list',
            loadChildren: () => import('../doctor-list/doctor-list.module').then(m => m.DoctorListPageModule)
          },
        ]
      },
      {
        path: 'doctors',
        loadChildren: () =>
          import('../doctors/doctors.module').then((m) => m.DoctorsPageModule),
      },
      {
        path: 'people',
        children: [
          {
            path: '',
            loadChildren: () => import('../people/list-people/list-people.module').then(m => m.ListPeoplePageModule)
          },
          {
            path: 'add-person',
            loadChildren: () => import('../people/add-person/add-person.module').then(m => m.AddPersonPageModule)
          },
          {
            path: 'appointment-details',
            loadChildren: () => import('../appointment-details/appointment-details.module').then(m => m.AppointmentDetailsPageModule)
          },
        ]
      },

      {
        path: 'appointments',
        children: [
          {
            path: '',
            loadChildren: () => import('../appointments/appointments.module').then(m => m.AppointmentsPageModule)
          },
          {
            path: 'appointment-details',
            loadChildren: () => import('../appointment-details/appointment-details.module').then(m => m.AppointmentDetailsPageModule)
          },
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'edit-profile',
            loadChildren: () => import('../edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
          },
          {
            path: 'notification',
            loadChildren: () => import('../notification/notification.module').then(m => m.NotificationPageModule)
          },
          {
            path: 'faqs',
            loadChildren: () => import('../faqs/faqs.module').then(m => m.FaqsPageModule)
          },
          {
            path: 'help-centre',
            loadChildren: () => import('../help-centre/help-centre.module').then(m => m.HelpCentrePageModule)
          },
          {
            path: 'languages',
            loadChildren: () => import('../languages/languages.module').then(m => m.LanguagesPageModule)
          },
          {
            path: 'invite-friends',
            loadChildren: () => import('../invite-friends/invite-friends.module').then(m => m.InviteFriendsPageModule)
          },
          {
            path: 'favourite',
            loadChildren: () => import('../favourite/favourite.module').then(m => m.FavouritePageModule)
          },
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
