import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput, AlertController, ViewController } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-performance-modal',
  templateUrl: 'performance-modal.html',
})
export class PerformanceModalPage {

  @ViewChild(Content) content: Content;
  performanceList: any[];
  person: any = {
    performanceName: '',
    noOfParticipants: '',
    specialNeed: '',
  };
  max_attendees: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public theme: ThemeProvider,
  ) {
    this.max_attendees = this.navParams.get('max_attendees');

    if (this.navParams.get('data')) {
      this.person = this.navParams.get('data');
    } else {
      this.person = {
        performanceName: '',
        noOfParticipants: '',
        specialNeed: '',
      }
    }
    this.getPerformanceList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerformanceModalPage', this.person);
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
    this.savePerformance();
  }

  savePerformance() {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/SavePerformance', {
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      event_id: this.navParams.get('id'),
      performance_id: this.person.performanceName,
      special_needs: this.person.specialNeed,
      no_of_participants: this.person.noOfParticipants
    }).subscribe(
      res => {
        this.global.hideLoader();
        this.global.log(`savePerformance's data`, res);
        if (res.success == 'true') {
          this.viewCtrl.dismiss(this.person);
        } else {
          this.global.showToast(`${res.error}`);
        }
      }, err => {
        this.global.hideLoader();
        this.global.log(`savePerformance's data`, err);
        this.global.showToast(`some error in submitting data`);
      })
  }

  getPerformanceDetail() {
    // this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/GetPerformanceDetail`, { event_entry_id: this.navParams.get('event_entry_id'), user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of getPerformanceDetail`, res);
          if (res.success == 'true') {
            this.person.performanceName = +res.performancedetail[0].performance_name;
            this.person.noOfParticipants = +res.performancedetail[0].no_of_participants;
            this.person.specialNeed = res.performancedetail[0].special_needs;
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of getPerformanceList`, err);
        });
  }

  getPerformanceList() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/PerformanceList`, { event_id: this.navParams.get('id') })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of getPerformanceList`, res);
          if (res.success == 'true' && res.performance.length > 0) {
            this.performanceList = res.performance;
            // this.person.performanceName = this.performanceList[0].id;
            if (this.navParams.get('event_entry_id')) {
              this.getPerformanceDetail();
            } else {
              this.global.hideLoader();
            }
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of getPerformanceList`, err);
        });
  }

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

}
