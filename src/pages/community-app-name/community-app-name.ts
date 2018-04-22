import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-app-name',
  templateUrl: 'community-app-name.html',
})
export class CommunityAppNamePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppNamePage');
  }

  personDetails() {
    this.global.log(`in personDetails's method`);
  }

  makeCall() {
    this.global.log(`in makeCall's method`);
  }

  makeMail() {
    this.global.log(`in makeMail's method`);
  }

  makeChat() {
    this.global.log(`in makeChat's method`);
  }

}
