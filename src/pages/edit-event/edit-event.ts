import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  event: any;
  eventPerson: string[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
  }

  ionViewDidLoad() {
    this.event = this.navParams.get('data');
    this.event['description'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    console.log('ionViewDidLoad EditEventPage', this.event);
  }

  eventPersonChange(ev: any) {
    this.global.log(`eventPersonChange's event is ${ev}`);
  }

  submit() {
    this.global.log(`submit's method`);
  }

  openCalendar() {
    this.global.log(`openCalendar's method`);
  }

  cancel() {
    this.global.log(`cancel's method`);
  }
}
