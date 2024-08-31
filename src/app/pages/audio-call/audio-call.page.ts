
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-audio-call',
  templateUrl: './audio-call.page.html',
  styleUrls: ['./audio-call.page.scss'],
})
export class AudioCallPage implements OnInit {

  constructor(
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

}
