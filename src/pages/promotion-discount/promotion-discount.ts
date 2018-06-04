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
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.getPromotionAndDiscountData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDiscountPage');
  }

  openDetails(i: number) {
    this.global.log('openDetails');
    this.navCtrl.push('PromotionDetailsPage', { data: this.promotionAndDiscountData.New[i] });
  }

  openCat(_i: number) {
    this.promotionAndDiscountData.New.forEach((people, i) => {
      if (i == _i) {
        this.promotionAndDiscountData.New[i].show = !this.promotionAndDiscountData.New[i].show;
      } else {
        this.promotionAndDiscountData.New[i].show = false;
      }
    });
  }

  getPromotionAndDiscountData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/PromtionDiscount', {})
      .subscribe(
        res => {
          this.global.log(`getPromotionAndDiscountData's res`, res);
          this.global.hideLoader();
          if (res.success == 'true') {
            this.noData = false;
            this.promotionAndDiscountData = res.data;
            this.promotionAndDiscountData.New.forEach(e => {
              e["show"] = false;
            });
            if (this.promotionAndDiscountData.New.length == 1) {
              this.promotionAndDiscountData.New[0].show = true;
            }
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
