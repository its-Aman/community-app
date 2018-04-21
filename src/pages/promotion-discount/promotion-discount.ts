import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-promotion-discount',
  templateUrl: 'promotion-discount.html',
})
export class PromotionDiscountPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDiscountPage');
  }

  openDetails() {
    this.global.log('openDetails()');
    this.navCtrl.push('PromotionDetailsPage', { data: null });
  }
}
