
import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';  // Importa o PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';
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
    @Inject(PLATFORM_ID) private platformId: any // Injeção do platformId
  ) { }

  ngOnInit(): void {
    // Verifica se estamos no navegador antes de manipular o DOM
    if (isPlatformBrowser(this.platformId)) {
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
