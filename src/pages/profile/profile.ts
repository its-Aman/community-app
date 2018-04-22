import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  modeOfCommunication: string[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  edit() {
    this.global.log('edit clicked');
  }
}
