import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-performance-modal',
  templateUrl: 'performance-modal.html',
})
export class PerformanceModalPage {

  person: any = {
    performanceName: 'bd',
    noOfParticipants: '09',
    specialNeed: 'Extra',
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    if (this.navParams.get('data')) {
      this.person = this.navParams.get('data');
    } else {
      this.person = {
        performanceName: 'bd',
        noOfParticipants: '09',
        specialNeed: 'Extra',
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerformanceModalPage');
  }

  change(ip, col) {
    // this.global.log('this.ip is ', ip, col);
    if (ip) {

      let element = ip._elementRef.nativeElement;

      let textarea: HTMLElement = element.getElementsByTagName('textarea')[0];

      // set default style for textarea
      textarea.style.minHeight = '0';
      textarea.style.height = '0';

      // limit size to 96 pixels (6 lines of text)
      let scroll_height = textarea.scrollHeight;
      if (scroll_height > 80) {
        scroll_height = 80;
      }

      // apply new style
      if (scroll_height > 49) {
        col.style.height = scroll_height + 20 + 'px';
      } else {
        col.style.height = '50px';
      }
      element.style.height = scroll_height + 20 + "px";
      textarea.style.minHeight = scroll_height + "px";
      textarea.style.height = scroll_height + "px";
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  submit() {
    this.viewCtrl.dismiss(this.person);
  }
}
