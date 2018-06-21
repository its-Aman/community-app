import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';

declare var google;

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  contactData: any;
  noData: boolean;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private theme: ThemeProvider,
    private iab: InAppBrowser
  ) {
    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  getData() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/ContactUs', {})
      .subscribe(res => {
        this.global.log(`contact data is `, res);
        if (res.success == 'true') {
          this.noData = false;
          this.contactData = res;
          if (res.geo_lat) {
            this.loadMap({ latitude: +res.geo_lat, longitude: +res.geo_long });
          }
        } else {
          this.noData = true;
          this.global.showToast(`No data found`);
        }
      }, err => {
        this.noData = true;
        this.global.log(`some error in contact us data`, err);
      });
  }

  openPhone() {
    this.global.log(`in openPhone`);
    document.location.href = `tel:${this.contactData.phone_no}`;
  }

  openMail() {
    this.global.log(`in openMail`);
    document.location.href = `mailto:${this.contactData.email}?subject=Dear%20Community%20Member%20`;
  }

  openBrowser() {
    this.global.log(`in openBrowser`, this.contactData.website);
    let _iab: InAppBrowserObject = this.iab.create(this.contactData.website, '_system');

    _iab.show();
  }

  loadMap(coords: any) {
    let mapOptions = {
      center: { lat: coords.latitude, lng: coords.longitude },
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
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
}
