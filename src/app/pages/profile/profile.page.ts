import { TokenService } from './../../services/token.service';

import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any;
  constructor(
    public util: UtilService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    this.user = this.tokenService.getUser();
  }

  onPage(name: any) {
    this.util.navigateToPage(name);
  }

}
