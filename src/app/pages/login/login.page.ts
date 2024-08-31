import { AuthService } from './../../services/auth.service';
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordView: boolean = false;
  submitAttempt: boolean = false;
  signinForm: FormGroup<any>;

  constructor(
    public util: UtilService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
  }

  async signIn() {
    this.submitAttempt = true;

    if (this.signinForm.invalid) {
      this.presentToast('Error', 'Please input valid email and password', 'top', 'danger', 2000);
      console.log('Email:', 'Password:');
      return;
    }

    // const loading = await this.loadingController.create({
    //   cssClass: 'default-loading',
    //   message: '<p>Signing in...</p><span>Please be patient.</span>',
    //   spinner: 'crescent'
    // });
    // await loading.present();

    const { email, password } = this.signinForm.value;

    this.authService.signIn(email, password).subscribe({
      next: async (response: any) => {

        await this.router.navigate(['/tabs']);
        // loading.dismiss();

        const user = response.user;
        await this.presentToast('Success', `Bem-vindo de volta, ${user.name}!`, 'top', 'success', 2000);

      },
      error: async (error) => {
        // Lida com erro de login
        // loading.dismiss();
        await this.presentToast('Error', 'Falha no login. Tente novamente.', 'top', 'danger', 2000);

      },
      complete: () => {
        // Lógica final opcional
      }
    });
  }

  async presentToast(header: string, message: string, position: 'top' | 'middle' | 'bottom', color: string, duration: number) {
    const toast = await this.toastController.create({
      header,
      message,
      position,
      color,
      duration
    });
    await toast.present();
  }

  isEmailInvalid() {
    const control = this.signinForm.get('email');
    return control && control.touched && control.invalid;
  }

  isPasswordInvalid() {
    const control = this.signinForm.get('password');
    return control && control.touched && control.invalid;
  }

  togglePasswordView() {
    this.passwordView = !this.passwordView;
  }

  onResetPassword() {
    this.util.navigateToPage('reset-password');
  }

  onHome() {
    this.util.navigateRoot('/tabs');
  }

  onRegister() {
    this.util.navigateToPage('/register');
  }

}
