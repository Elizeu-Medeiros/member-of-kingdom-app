
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.page.html',
  styleUrls: ['./write-review.page.scss'],
})
export class WriteReviewPage implements OnInit {

  star: any = 2;
  constructor(
    public util: UtilService,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private pid: Object,
    @Inject(DOCUMENT) private doc: Document
  ) { }


  ionViewDidEnter() {
    if (isPlatformBrowser(this.pid)) {
      this.renderer.setAttribute(this.doc.documentElement, 'lang', 'en');
    }
  }

  ionViewWillLeave() {
    if (isPlatformBrowser(this.pid)) {
      this.renderer.removeAttribute(this.doc.documentElement, 'lang');
    }
  }

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      this.renderer.setAttribute(document.documentElement, 'lang', 'en');
    }
  }

  onBack() {
    this.util.onBack();
  }

  changeStar(num: any) {
    this.star = num;
  }


}
