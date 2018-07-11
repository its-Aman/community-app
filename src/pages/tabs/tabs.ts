import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  // page1: string = 'HomePage';
  page1: string = 'CommunityAppNamePage';
  page2: string = 'EventPage';
  page3: string = 'ChatListPage';
  page4: string = 'ProfilePage';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public global: GlobalProvider,
    public events: Events,
  ) {
    this.listenForTabsChange();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');

    this.events.subscribe('setEventPage', () => {
      // this.superTabs.selectedTabIndex = +JSON.parse(localStorage.getItem('user')).totalevents > 0 ? 1 : 0;
      this.superTabs.slideTo(1);
      this.global.log(`in subscribe event setEventPage`, this.superTabs.selectedTabIndex);
      this.global.hideLoader();
    });

    this.checkLiveEvent();
  }

  listenForTabsChange() {
    this.event.subscribe('select-page', (page) => {
      this.global.log("in listenForTabsChange()'s select-page", page);
      if (page == 'chat') {
        this.superTabs.slideTo(2);
      }
    });

    this.event.subscribe('select-edit-profile', (page) => {
      this.global.log("in listenForTabsChange()'s select-edit-profile", page);
      if (page == 'profile') {
        this.superTabs.slideTo(3);
      }
    });
  }

  checkLiveEvent() {
    // this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/GetActiveEventsCount`, {})
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`OtpVerify response`, res);
          if (res.success == 'true' && +res.totalevents > 0) {
            this.superTabs.slideTo(1);
            setTimeout(() => {
              this.global.hideLoader();
            }, 3000);
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`OtpVerify error`, err);
        });
  }
}
