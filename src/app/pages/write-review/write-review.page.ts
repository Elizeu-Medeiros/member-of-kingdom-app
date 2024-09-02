
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
    private renderer: Renderer2
  ) { }

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
