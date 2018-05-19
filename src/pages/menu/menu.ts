import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Menu } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootMenuPage: string = 'TabsPage';
  @ViewChild(Menu) menu: Menu;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    private events: Events
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  vendorList() {
    this.global.log('vendorList');
    this.navCtrl.push('CommunityAppPage', { data: null })
  }

  promotionDiscount() {
    this.global.log('promotionDiscount');
    this.navCtrl.push('PromotionDiscountPage', { data: null })
  }

  aboutUs() {
    this.global.log('aboutUs');
    this.navCtrl.push('AboutPage', { data: null });
  }

  contactUs() {
    this.global.log('contactUs');
    this.navCtrl.push('ContactUsPage', { data: null });
  }

  setting() {
    this.global.log('setting');
    this.navCtrl.push('ChangePinPage');
  }

  privacyPolicy() {
    this.global.log('privacyPolicy');
    this.navCtrl.push('PrivacyPolicyPage', { data: null });
  }

  logout() {
    this.global.log('logout');
    this.navCtrl.setRoot('LoginPage', { signInData: true });
  }

  editProfile() {
    this.global.log('editProfile');
    this.menu.close().then(res => {
      this.events.publish('select-edit-profile', 'profile');
    });
  }
}
