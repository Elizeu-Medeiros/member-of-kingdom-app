
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'appointment-details',
    loadChildren: () => import('./pages/appointment-details/appointment-details.module').then(m => m.AppointmentDetailsPageModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./pages/appointments/appointments.module').then(m => m.AppointmentsPageModule)
  },
  {
    path: 'audio-call',
    loadChildren: () => import('./pages/audio-call/audio-call.module').then(m => m.AudioCallPageModule)
  },
  {
    path: 'book-appointment',
    loadChildren: () => import('./pages/book-appointment/book-appointment.module').then(m => m.BookAppointmentPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule)
  },
  {
    path: 'chats',
    loadChildren: () => import('./pages/chats/chats.module').then(m => m.ChatsPageModule)
  },
  {
    path: 'doctor-info',
    loadChildren: () => import('./pages/doctor-info/doctor-info.module').then(m => m.DoctorInfoPageModule)
  },
  {
    path: 'doctor-list',
    loadChildren: () => import('./pages/doctor-list/doctor-list.module').then(m => m.DoctorListPageModule)
  },
  {
    path: 'doctors',
    loadChildren: () => import('./pages/doctors/doctors.module').then(m => m.DoctorsPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'faqs',
    loadChildren: () => import('./pages/faqs/faqs.module').then(m => m.FaqsPageModule)
  },
  {
    path: 'favourite',
    loadChildren: () => import('./pages/favourite/favourite.module').then(m => m.FavouritePageModule)
  },
  {
    path: 'help-centre',
    loadChildren: () => import('./pages/help-centre/help-centre.module').then(m => m.HelpCentrePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'invite-friends',
    loadChildren: () => import('./pages/invite-friends/invite-friends.module').then(m => m.InviteFriendsPageModule)
  },
  {
    path: 'languages',
    loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'new-card',
    loadChildren: () => import('./pages/new-card/new-card.module').then(m => m.NewCardPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule)
  },
  {
    path: 'payment-method',
    loadChildren: () => import('./pages/payment-method/payment-method.module').then(m => m.PaymentMethodPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./pages/reviews/reviews.module').then(m => m.ReviewsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'success-payment',
    loadChildren: () => import('./pages/success-payment/success-payment.module').then(m => m.SuccessPaymentPageModule)
  },
  {
    path: 'video-call',
    loadChildren: () => import('./pages/video-call/video-call.module').then(m => m.VideoCallPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'write-review',
    loadChildren: () => import('./pages/write-review/write-review.module').then(m => m.WriteReviewPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
