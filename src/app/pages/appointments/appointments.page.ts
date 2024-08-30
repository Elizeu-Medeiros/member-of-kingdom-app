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
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
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
    this.util.navigateToPage('tabs/appointments/appointment-details');
  }

}
