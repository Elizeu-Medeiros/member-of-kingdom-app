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
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  savedList: any[] = [];
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  onSave(name: any) {
    if (this.savedList.includes(name)) {
      this.savedList = this.savedList.filter(x => x != name);
    } else {
      this.savedList.push(name);
    }
  }

  onDoctorList() {
    this.util.navigateToPage('/tabs/home/doctor-list');
  }

}
