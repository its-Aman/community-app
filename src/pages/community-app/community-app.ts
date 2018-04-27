import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-community-app',
  templateUrl: 'community-app.html',
})
export class CommunityAppPage {

  peoples: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.peoples = [
      { name: 'Plumber', show: false },
      { name: 'Electrician', show: false },
      { name: 'Grocery Shop', show: false },
      { name: 'Doctor', show: false },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppPage');
  }

  openDetails() {
    this.navCtrl.push('VendorProfilePage', { data: null });
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
