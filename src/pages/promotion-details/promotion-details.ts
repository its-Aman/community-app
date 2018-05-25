import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

declare var google;

@IonicPage()
@Component({
  selector: 'page-promotion-details',
  templateUrl: 'promotion-details.html',
})
export class PromotionDetailsPage {

  noData: boolean;
  couponDetail: any;
  previousPageData: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.previousPageData = this.navParams.get('data');
    this.getCouponDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionDetailsPage');
  }

  getCouponDetail() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/PromtionDetails', { promtion_id: this.previousPageData.id })
      .subscribe(
        res => {
          this.global.hideLoader();
          if (res.success == 'true') {
            this.noData = false;
            this.couponDetail = res.Promotiondetail;
            if (this.couponDetail.geo_lat && this.couponDetail.geo_long) {
              this.loadMap({ latitude: this.couponDetail.geo_lat, longitude: this.couponDetail.geo_long });
            }
          } else {
            this.global.showToast(`${res.error}`);
            this.noData = true;
          }
        }, err => {
          this.noData = true;
          this.global.hideLoader();

        });

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
