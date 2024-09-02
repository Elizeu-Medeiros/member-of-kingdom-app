
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-success-payment',
  templateUrl: './success-payment.page.html',
  styleUrls: ['./success-payment.page.scss'],
})
export class SuccessPaymentPage implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
