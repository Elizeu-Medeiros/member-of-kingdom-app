
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  activeIndex: any = 0;
  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  changed() {
    this.activeIndex = this.swiper?.nativeElement.swiper.activeIndex;
  }

  onAuth() {
    this.util.navigateRoot('/login');
  }
}
