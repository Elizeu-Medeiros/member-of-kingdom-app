import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { Inject } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(@Inject(PLATFORM_ID) private pid: Object) {
    if (isPlatformBrowser(this.pid)) {
      document.body.classList.toggle('dark', true);
      // REMOVA esta linha, se ainda existir:
      // document.documentElement.setAttribute('color-theme', 'dark');
    }
  }
}
