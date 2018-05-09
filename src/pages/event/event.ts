import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  eventDummydata: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
    this.getEventList();
  }

  getEventList() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/EventList`, {})
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`event list response`, res);
          if (res.success == 'true') {
            // this.global.showToast(`${res.message}`);
            this.eventDummydata = res.event;
            this.eventDummydata.forEach((res, i) => {
              this.eventDummydata[i].event_image = this.global.sanatizeImage(`${this.eventDummydata[i].event_image}`);
            });
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.log(`event list error`, err);
          this.global.hideLoader();
        });
  }

  openEvent(i: number) {
    this.global.log('in openEvent() with data ', this.eventDummydata[i]);
    this.navCtrl.push('CommunityNamePage', { data: this.eventDummydata[i] });
  }
}
