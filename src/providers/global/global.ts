import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading, App, Events } from 'ionic-angular';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class GlobalProvider {

  loader: Loading;
  base_path: string;

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    private app: App,
    public events: Events
  ) {
    console.log('Hello GlobalProvider Provider');
    this.base_path = '';
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
    return this.http.get<any>(url)
  }

  postRequest(url: string, data: any) {
    return this.http.post<any>(url, data, httpOptions)
  }
}
