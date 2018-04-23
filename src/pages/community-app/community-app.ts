import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-app',
  templateUrl: 'community-app.html',
})
export class CommunityAppPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppPage');
  }

  openDetails(){
    this.navCtrl.push('VendorProfilePage', { data: null });    
  }
}
