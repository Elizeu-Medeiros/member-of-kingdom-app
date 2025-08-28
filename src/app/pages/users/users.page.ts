
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  active: any = 'upcoming';
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onChange(name: any) {
    this.active = name;
  }

  onDetails() {
    this.util.navigateToPage('tabs/users/user-details');
  }

}
