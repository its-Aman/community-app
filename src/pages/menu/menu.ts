import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootMenuPage: string = 'TabsPage';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  vendorList() {
    this.global.log('vendorList');
  }

  promotionDiscount() {
    this.global.log('promotionDiscount');
    this.navCtrl.push('PromotionDiscountPage', { data: null })
  }

  aboutUs() {
    this.global.log('aboutUs');
  }

  contactUs() {
    this.global.log('contactUs');
  }

  setting() {
    this.global.log('setting');
  }

  privacyPolicy() {
    this.global.log('privacyPolicy');
  }

  logout() {
    this.global.log('logout');
  }
}