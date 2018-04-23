import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  eventDummydata: any[] = [
    {
      name: 'Event Name',
      from: '02-01-2018',
      to: '03-02-2018',
    },
    {
      name: 'Event Name',
      from: '02-01-2018',
      to: '03-02-2018',
    },

    {
      name: 'Event Name',
      from: '02-01-2018',
      to: '03-02-2018',
    },

  ]
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventPage');
  }

  openEvent(i: number) {
    this.global.log('in openEvent() with data ', this.eventDummydata[i]);
    this.navCtrl.push('CommunityNamePage', { data: this.eventDummydata[i] });
  }
}
