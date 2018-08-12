import { FCM } from '@ionic-native/fcm';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading, Events, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthKey': '171195abc123171195abc123171195',
  })
};
// 'Access-Control-Allow-Origin':'*',
// 'Access-Control-Allow-Methods':'POST',
// 'Accept':'application/json',

@Injectable()
export class GlobalProvider {

  loader: Loading;
  base_path: string;
  image_base_path: string;
  tiny_basePath_testing: String;
  tiny_basePath_live: String;
  defaultImage: string = `assets/icon/sidebar-profile-photo.png`;

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    public platform: Platform,
    private sanitizer: DomSanitizer,
    private fcm: FCM
  ) {
    console.log('Hello GlobalProvider Provider');
    this.tiny_basePath_testing = `http://winstech.in/community/`;
    this.tiny_basePath_live = `http://winstech.in/live_rauk/`;

    //test
    this.base_path = `${this.tiny_basePath_testing}web_panel/app/`;
    this.image_base_path = `${this.tiny_basePath_testing}uploads/`;

    //live
    // this.base_path = `${this.tiny_basePath_live}web_panel/app/`;
    // this.image_base_path = `${this.tiny_basePath_live}uploads/`;
  }

  sanatizeImage(isEvent: boolean = false, image: string): any {
    if (isEvent) {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.image_base_path + 'event/' + image})`);
    } else {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.image_base_path + image})`);
    }
  }

  cLog(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  showLoader(msg?) {
    this.loader = this.loadingController.create({
      content: msg ? msg : 'Loading..',
      dismissOnPageChange: true
    });
    this.loader.present().catch(res => { console.log("exception in show loader") });
  }

  hideLoader() {
    if (this.loader) {
      try {
        this.loader.dismiss()
          .then(res => {
            // this.loader = null;
          })
          .catch(err => {
            console.log("exception in loader hide", err);
            setTimeout(v => { this.hideLoader(); }, 100)
          });
      }
      catch (e) { }
    }
  }

  showToast(message: string, duration: number = 2000, position: string = 'top') {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: false,
    }).present();
  }

  getRequest(url: string) {
    return this.http.get<any>(url, httpOptions);
  }

  postRequest(url: string, data: any) {
    return this.http.post<any>(url, data, httpOptions);
  }

  getFcmToken() {
    this.fcm.getToken().then(token => {
      this.cLog(`got FCM push token `, token);
      localStorage.setItem('fcm_token', token);
    });


    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        this.cLog("Received in background", data);
        this.events.publish('select-page', data);
      } else {
        this.cLog("Received in foreground", data);
        if (localStorage.getItem('chatPage')) {
          let foo = {
            entry_date_time: new Date().toISOString(),
            from_user_id: data.from_sender_id,
            message: data.body,
            to_user_id: data.to_sender_id,
            user_image: data.user_image ? data.user_image : null,
            id: data.message_id
          }
          this.cLog(`firing chatPageData event with data`, data, foo);
          this.events.publish('chatPageData', foo);
        } else {
          this.events.publish('select-page', data);
        }
      };
    });

    this.fcm.onTokenRefresh().subscribe(token => {
      this.cLog(`got refereshed FCM push token `, token);
      localStorage.setItem('fcm_token', token);
    });
  }
}
