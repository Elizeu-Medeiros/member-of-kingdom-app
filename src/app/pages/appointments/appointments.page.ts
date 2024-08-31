
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
