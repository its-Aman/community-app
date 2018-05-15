import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-vendor-profile',
  templateUrl: 'vendor-profile.html',
})
export class VendorProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,    
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorProfilePage');
  }

  changeProfilePicture() {
    this.global.log('changeProfilePicture clicked');
  }
}
