import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-promotion-discount',
  templateUrl: 'promotion-discount.html',
})
export class PromotionDiscountPage {

  cat: boolean[] = [false, false, false, false, false];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDiscountPage', this.cat);
  }

  openDetails() {
    this.global.log('openDetails()');
    this.navCtrl.push('PromotionDetailsPage', { data: null });
  }
  openCat(_i: number) {
    this.cat.forEach((people, i) => {
      if (i == _i) {
        this.cat[i] = !this.cat[i];
      } else {
        this.cat[i] = false;
      }
    });
  }
}
