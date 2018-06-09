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

  vendorList: any[];
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
          this.global.log(`getdata response`, res);
          if (res.success == 'true') {
            // this.peoples = [
            //   { name: 'Plumber', show: false },
            //   { name: 'Electrician', show: false },
            //   { name: 'Grocery Shop', show: false },
            //   { name: 'Doctor', show: false },
            // ];
            this.vendorList = res.data;
            this.vendorList.forEach(v => {
              v['show'] = false;
            });
            // if (this.vendorList.length == 1) {
            //   this.vendorList[0].show = true;
            // }
            this.noData = false;
          } else {
            this.noData = true;
          }
        }, err => {
          this.global.hideLoader();
          this.noData = true;
        })
  }

  openDetails(people: any) {
    this.global.log(`in open details`, people)
    this.navCtrl.push('VendorProfilePage', { data: people });
  }

  openPeopleDetails(_i: number) {
    this.vendorList.forEach((people, i) => {
      if (i == _i) {
        this.vendorList[i].show = !this.vendorList[i].show;
      } else {
        this.vendorList[i].show = false;
      }
    });
  }
}
