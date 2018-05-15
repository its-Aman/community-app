import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ThemeProvider } from '../../providers/theme/theme';

declare var google;

@IonicPage()
@Component({
  selector: 'page-promotion-details',
  templateUrl: 'promotion-details.html',
})
export class PromotionDetailsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private geolocation: Geolocation,
    public theme: ThemeProvider,    
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDetailsPage');
    this.getCoordinates();
  }

  getCoordinates() {
    this.geolocation.getCurrentPosition().then(res => {
      this.global.log('geolocation res', res);
      this.loadMap(res.coords);
    }).catch(err => {
      this.global.log('some error in geolocation', err);
      if (err.code == 1) {
        this.global.showToast(err.message);
      }
    });
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
}
