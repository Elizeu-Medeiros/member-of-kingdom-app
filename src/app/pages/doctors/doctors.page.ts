
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  selected: any = 'all';
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onDoctorInfo(name: any) {
    const param: NavigationExtras = {
      queryParams: {
        name: name
      }
    };
    this.util.navigateToPage('doctor-info', param);
  }

}
