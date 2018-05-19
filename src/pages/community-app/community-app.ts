import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-community-app',
  templateUrl: 'community-app.html',
})
export class CommunityAppPage {

  vendorList: any;
  noData: boolean;
  peoples: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppPage');
  }

  getData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/VendorList', {})
      .subscribe(
        res => {
          this.global.hideLoader();
          if (res.success == 'true') {
            this.peoples = [
              { name: 'Plumber', show: false },
              { name: 'Electrician', show: false },
              { name: 'Grocery Shop', show: false },
              { name: 'Doctor', show: false },
            ];
            this.vendorList = res.vendors;
            this.noData = false;
          } else {
            this.noData = true;
          }
        }, err => {
          this.global.hideLoader();
          this.noData = true;
        })
  }

  openDetails(i) {
    this.navCtrl.push('VendorProfilePage', { data: this.vendorList[i] });
  }

  openPeopleDetails(_i: number) {
    this.peoples.forEach((people, i) => {
      if (i == _i) {
        this.peoples[i].show = !this.peoples[i].show;
      } else {
        this.peoples[i].show = false;
      }
    });
  }
}
