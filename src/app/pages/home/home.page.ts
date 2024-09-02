import { TokenService } from './../../services/token.service';

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

  user: any;

  constructor(
    public util: UtilService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
    // Obtém os dados do usuário do localStorage usando TokenService
    this.user = this.tokenService.getUser();
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
