/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { NavigationExtras } from '@angular/router';
import { register } from 'swiper/element';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  slideOtp = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 10,
  };

  slideOtpCategories = {
    initialSlide: 0,
    slidesPerView: 4,
    spaceBetween: 10,
  };
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onCategories() {
    this.util.navigateToPage('/tabs/home/categories');
  }

  onSearch() {
    this.util.navigateToPage('/tabs/home/search');
  }

  onDoctorList() {
    this.util.navigateToPage('/tabs/home/doctor-list');
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
