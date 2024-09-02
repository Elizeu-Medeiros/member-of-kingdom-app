
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-help-centre',
  templateUrl: './help-centre.page.html',
  styleUrls: ['./help-centre.page.scss'],
})
export class HelpCentrePage implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

}
