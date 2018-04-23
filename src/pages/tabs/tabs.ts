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
  page3: string = 'ChatPage';
  page4: string = 'ProfilePage';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public global: GlobalProvider,
  ) {
    this.listenForTabsChange();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  listenForTabsChange() {
    this.event.subscribe('select-page', (page) => {
      this.global.log('in listenForTabsChange()', page);
      if (page == 'chat') {
        this.superTabs.slideTo(2);
      }
    });
  }
}
