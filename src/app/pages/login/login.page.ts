/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordView: boolean = false;
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  toggePassword() {
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
