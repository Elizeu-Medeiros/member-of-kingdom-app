
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.page.html',
  styleUrls: ['./doctor-list.page.scss'],
})
export class DoctorListPage implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
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
