import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  noData: boolean;

  @ViewChild('pTag') pTag: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private global: GlobalProvider
  ) {
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  getData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/Aboutus', {})
      .subscribe(res => {
        this.global.log(`contact data is `, res);
        if (res.success == 'true') {
          this.noData = false;
          this.pTag.nativeElement.innerHTML = res.aboutus;
        } else {
          this.noData = true;
          this.global.showToast(`No data found`);
        }
      }, err => {
        this.noData = true;
        this.global.log(`some error in contact data is `, err);
      });
  }


}