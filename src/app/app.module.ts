
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageRoutingModule } from './pages/login/login-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage'; // Módulo de Storage
import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Inicialização do Firebase
    AngularFireStorageModule, // Módulo de Storage
    IonicModule.forRoot(),
    AppRoutingModule], providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      provideHttpClient(withInterceptorsFromDi())
  ]
})
export class AppModule { }
