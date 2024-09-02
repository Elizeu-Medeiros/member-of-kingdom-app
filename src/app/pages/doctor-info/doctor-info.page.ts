
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-doctor-info',
  templateUrl: './doctor-info.page.html',
  styleUrls: ['./doctor-info.page.scss'],
})
export class DoctorInfoPage implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  onBook() {
    this.util.navigateToPage('book-appointment');
  }

}
