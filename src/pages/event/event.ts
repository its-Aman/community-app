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
  //   this.eventDummydata = [
  //   	{
  //       	"id": "6",
  //       	"event_type": "1",
  //       	"event_name": "dfg",
  //       	"from_date": "2018-05-24",
  //       	"to_date": "2018-05-25",
  //       	"description": "fsd",
  //       	"max_attendees": "20",
  //       	"event_image": "1916958571.png",
  //       	"entry_for": "0",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "fdg",
  //       	"city_id": "6433",
  //       	"state_id": "165",
  //       	"country_id": "4",
  //       	"pincode": "963526",
  //       	"status_id": "2",
  //       	"entry_date": "2018-05-01"
  //   	},
  //   	{
  //       	"id": "5",
  //       	"event_type": "1",
  //       	"event_name": "dfg",
  //       	"from_date": "2018-05-24",
  //       	"to_date": "2018-05-25",
  //       	"description": "fsd",
  //       	"max_attendees": "20",
  //       	"event_image": "336943599.png",
  //       	"entry_for": "0",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "fdg",
  //       	"city_id": "6094",
  //       	"state_id": "114",
  //       	"country_id": "3",
  //       	"pincode": "963526",
  //       	"status_id": "2",
  //       	"entry_date": "2018-05-01"
  //   	},
  //   	{
  //       	"id": "4",
  //       	"event_type": "1",
  //       	"event_name": "dfg",
  //       	"from_date": "2018-05-24",
  //       	"to_date": "2018-05-25",
  //       	"description": "fsd",
  //       	"max_attendees": "20",
  //       	"event_image": "791479910.png",
  //       	"entry_for": "0",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "fdg",
  //       	"city_id": "1",
  //       	"state_id": "1",
  //       	"country_id": "1",
  //       	"pincode": "963526",
  //       	"status_id": "1",
  //       	"entry_date": "2018-05-01"
  //   	},
  //   	{
  //       	"id": "3",
  //       	"event_type": "1",
  //       	"event_name": "dfg",
  //       	"from_date": "2018-05-24",
  //       	"to_date": "2018-05-25",
  //       	"description": "fsd",
  //       	"max_attendees": "20",
  //       	"event_image": "97764701.png",
  //       	"entry_for": "0",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "fdg",
  //       	"city_id": "1",
  //       	"state_id": "1",
  //       	"country_id": "1",
  //       	"pincode": "963526",
  //       	"status_id": "1",
  //       	"entry_date": "2018-05-01"
  //   	},
  //   	{
  //       	"id": "2",
  //       	"event_type": "1",
  //       	"event_name": "dfg",
  //       	"from_date": "2018-05-24",
  //       	"to_date": "2018-05-25",
  //       	"description": "fsd",
  //       	"max_attendees": "20",
  //       	"event_image": "457860466.png",
  //       	"entry_for": "0",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "fdg",
  //       	"city_id": "1",
  //       	"state_id": "1",
  //       	"country_id": "1",
  //       	"pincode": "963526",
  //       	"status_id": "1",
  //       	"entry_date": "2018-05-01"
  //   	},
  //   	{
  //       	"id": "1",
  //       	"event_type": "1",
  //       	"event_name": "Event Name",
  //       	"from_date": "2018-04-24",
  //       	"to_date": "2018-04-25",
  //       	"description": "Description",
  //       	"max_attendees": "20",
  //       	"event_image": "1685380469.png",
  //       	"entry_for": "2",
  //       	"price_type": "1",
  //       	"travel_info": "paid",
  //       	"geo_lat": "",
  //       	"geo_long": "",
  //       	"address": "Address",
  //       	"city_id": "5910",
  //       	"state_id": "42",
  //       	"country_id": "1",
  //       	"pincode": "963852",
  //       	"status_id": "2",
  //       	"entry_date": "0000-00-00"
  //   	}
	// ]

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
