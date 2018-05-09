import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading, App, Events, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json',
  })
};

@Injectable()
export class GlobalProvider {

  loader: Loading;
  base_path: string;
  image_base_path: string;

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    private app: App,
    public events: Events,
    public platform: Platform,
    private sanitizer: DomSanitizer,
  ) {
    console.log('Hello GlobalProvider Provider');
    this.base_path = 'http://winstech.in/community/web_panel/app/';
    this.image_base_path = 'http://winstech.in/community/uploads/event/';
  }

  sanatizeImage(image: string): any {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${this.image_base_path + image})`);
  }

  log(message?: any, ...optionalParams: any[]): void {
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
            this.loader = null;
          })
          .catch(res => {
            console.log("exception in loader hide");
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
      showCloseButton: true,
    }).present();
  }

  getRequest(url: string) {
    return this.http.get<any>(url);
  }

  postRequest(url: string, data: any) {
    return this.http.post<any>(url, data, httpOptions);
  }
}
