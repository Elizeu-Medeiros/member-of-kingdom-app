import { AuthService } from './../../services/auth.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;
  active: any = 1;
  constructor(
    public util: UtilService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOTP() {
    if (this.resetForm.valid) {
      const { email, newPassword } = this.resetForm.value;

      this.authService.sendResetLink(email).subscribe({
        next: () => {
          // Navegar para outra página ou exibir mensagem de sucesso
          this.onPage('/login');
        },
        error: (error) => {
          // Lidar com erro
          console.error('Error:', error);
        }
      });
    }
  }

  onPage(name: any) {
    this.util.navigateToPage(name);
  }

  onBack() {
    this.util.onBack();
  }

  onVerify() {
    this.active = 3;
  }

}
