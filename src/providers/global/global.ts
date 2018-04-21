import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading, App, Events } from 'ionic-angular';

@Injectable()
export class GlobalProvider {

  loader: Loading;

  constructor(
    public http: HttpClient,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    private app: App,
    public events: Events
  ) {
    console.log('Hello GlobalProvider Provider');
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
    try {
      this.loader.dismiss().catch(res => {
        console.log("exception in loader hide");
        setTimeout(v => { this.hideLoader(); }, 100)
      });
    }
    catch (e) { }
  }

  showToast(msg, duration?) {
    let finalDuration = 3000;
    if (duration)
      finalDuration = duration;
    let toast = this.toastCtrl.create({
      message: msg,
      duration: finalDuration,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }
}
