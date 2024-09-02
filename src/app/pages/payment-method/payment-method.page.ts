
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { SuccessPaymentPage } from '../success-payment/success-payment.page';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {

  selected: any = 'paypal';
  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  addNewCard() {
    this.util.navigateToPage('new-card');
  }

  async makePayment() {
    const modal = await this.modalController.create({
      component: SuccessPaymentPage,
      cssClass: 'success-modal'
    });
    await modal.present();
  }

}
