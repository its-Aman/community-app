import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-promotion-discount',
  templateUrl: 'promotion-discount.html',
})
export class PromotionDiscountPage {

  promotionAndDiscountData: any;
  noData: boolean;
  cat: boolean[] = [false, false, false, false, false];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.getPromotionAndDiscountData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDiscountPage', this.cat);
  }

  openDetails(i: number) {
    this.global.log('openDetails');
    this.navCtrl.push('PromotionDetailsPage', { data: this.promotionAndDiscountData.NEW[i] });
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

  getPromotionAndDiscountData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/PromtionDiscount', {})
      .subscribe(
        res => {
          this.global.hideLoader();
          if (res.success == 'true') {
            this.noData = false;
            this.promotionAndDiscountData = res.data;
          } else {
            this.global.showToast(`${res.error}`);
            this.noData = true;
          }
        }, err => {
          this.noData = true;
          this.global.hideLoader();

        });
  }
}
