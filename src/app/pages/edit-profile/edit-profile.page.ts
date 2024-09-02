import { TokenService } from './../../services/token.service';

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  user: User;

  constructor(
    public util: UtilService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    const userData = this.tokenService.getUser();
    if (userData) {
      this.user = userData as User; // Garanta que userData é do tipo User
    }
  }

  onBack() {
    this.util.onBack();
  }

}
