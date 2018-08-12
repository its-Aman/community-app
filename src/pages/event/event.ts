import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  noData: boolean;
  eventDummydata: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,
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
          this.global.cLog(`event list response`, res);
          if (res.success == 'true') {
            // this.global.showToast(`${res.message}`);
            this.noData = false;
            this.eventDummydata = res.event;
            this.eventDummydata.forEach((res, i) => {
              this.eventDummydata[i].event_image = this.global.sanatizeImage(true, `${this.eventDummydata[i].event_image}`);
            });
          } else {
            this.noData = true;
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.noData = true;
          this.global.cLog(`event list error`, err);
          this.global.hideLoader();
        });
  }

  openEvent(i: number) {
    this.global.cLog('in openEvent() with data ', this.eventDummydata[i]);
    this.navCtrl.push('CommunityNamePage', { data: this.eventDummydata[i] });
  }
}
