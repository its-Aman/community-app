import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

declare var google;

@IonicPage()
@Component({
  selector: 'page-community-name',
  templateUrl: 'community-name.html',
})
export class CommunityNamePage {

  personData: any;
  eventData: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private modal: ModalController,
    public theme: ThemeProvider,    
  ) {
  }

  ionViewDidEnter() {
    this.getEventDetail();
    console.log('ionViewDidEnter CommunityNamePage');

    // this.eventData = {
    //   "event": {
    //     "id": "1",
    //     "event_type": "1",
    //     "event_name": "Event Name",
    //     "from_date": "2018-04-24",
    //     "to_date": "2018-04-25",
    //     "description": "Description",
    //     "max_attendees": "20",
    //     "event_image": "1685380469.png",
    //     "entry_for": "2",
    //     "price_type": "0",
    //     "standard_price": "100.00",
    //     "travel_info": "paid",
    //     "geo_lat": "",
    //     "geo_long": "",
    //     "address": "Address",
    //     "city_id": "5910",
    //     "state_id": "42",
    //     "country_id": "1",
    //     "pincode": "963852",
    //     "status_id": "2",
    //     "entry_date": "0000-00-00"
    //   },
    //   "event_entry_id": "35",
    //   "totalseats": "20",
    //   "totalregistration": "13",
    //   "availableseats": 7,
    //   "message": "Successfully Done",
    //   "success": "true"
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityNamePage');
  }

  getEventDetail() {
    let data = {
      event_id: this.navParams.get('data').id,
      login_user_id: JSON.parse(localStorage.getItem('user')).id
    }
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/EventDetail', data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`geteventdetail res`, res);
          if (res.success == 'true') {
            this.eventData = res;

            if (this.eventData.event.geo_lat) {
              setTimeout(() => {
                this.loadMap({ latitude: parseFloat(this.eventData.event.geo_lat), longitude: parseFloat(this.eventData.event.geo_long) })
              }, 1000);
            }
            this.eventData.event.event_image = this.global.sanatizeImage(true, this.eventData.event.event_image);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`geteventdetail err`, err);
        });
  }

  openPlace() {
    this.global.log('in openPlace');
  }

  openCalendar() {
    this.global.log('in openCalendar');
  }

  loadMap(coords: any) {
    let mapOptions = {
      center: { lat: coords.latitude, lng: coords.longitude },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.global.log('map reference is ', this.map, coords);

    setTimeout(() => {
      this.addMarker();
    }, 1000);
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = '<h4>Information!</h4>';
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker: any, content: any): any {
    let infoWindow = new google.maps.InfoWindow({ content: content });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  edit() {
    this.global.log('in edit()');
    this.navCtrl.push('EditEventPage', {
      data: this.eventData
    });
  }

  registration() {
    this.global.log('in registration()');
    this.navCtrl.push('EventRegistrationPage', {
      data: this.eventData
    });
  }

  performance() {
    let performance = this.modal.create('PerformanceModalPage', { data: this.personData, id: this.eventData.event.id}, { cssClass: 'performance' });
    performance.present();
    performance.onDidDismiss(data => {
      this.global.log(`modal data`, data);
      if (data) {
        this.personData = data;
      }
    });
  }
}
