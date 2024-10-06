
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


@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent], imports: [BrowserModule,
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
