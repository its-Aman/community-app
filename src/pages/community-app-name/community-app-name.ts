import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-app-name',
  templateUrl: 'community-app-name.html',
})
export class CommunityAppNamePage {
  search: any;
  searchType: any = 'P';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public event: Events
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
    document.location.href = 'tel:+91123456789';
  }

  makeMail() {
    this.global.log(`in makeMail's method`);
    document.location.href = `mailto:user@example.com?subject=You're%20Awesome&body=Already%20told%20you`;
  }

  makeChat() {
    this.global.log(`in makeChat's method`);
    this.openChatPage();
  }

  openChatPage() {
    this.event.publish('select-page', 'chat');
  }
}
