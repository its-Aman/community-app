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

  noData: boolean;
  vendorDetail: any;
  previousPageData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.previousPageData = this.navParams.get('data');
    if (this.previousPageData.id) {
      this.getData();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorProfilePage');
  }

  getData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/VendorProfile', { vendor_id: this.previousPageData.id })
      .subscribe(
        res => {
          this.global.hideLoader();
          if (res.success == 'true') {

            this.vendorDetail = res.vendor;
            this.noData = false;
          } else {
            this.noData = true;
          }
        }, err => {
          this.global.hideLoader();
          this.noData = true;
        })
  }

  changeProfilePicture() {
    this.global.log('changeProfilePicture clicked');
  }
}
