import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-community-app-name',
  templateUrl: 'community-app-name.html',
})
export class CommunityAppNamePage {
  userList: any;
  search: any;
  searchType: any = 'P';
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public event: Events,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
  ) {
    // this.getProfessionalList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppNamePage');

    this.keyboard.onKeyboardHide().subscribe(
      res => {
        this.global.log(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });

    this.keyboard.onKeyboardShow().subscribe(
      res => {
        this.global.log(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });
  }

  personDetails() {
    this.global.log(`in personDetails's method`);
  }

  makeCall() {
    this.global.log(`in makeCall's method`);
    document.location.href = 'tel:+91123456789';
  }

  makeMail() {
    this.global.log(`in makeMail's method`);
    document.location.href = `mailto:user@example.com?subject=You're%20Awesome&body=Already%20told%20you`;
  }

  makeChat() {
    this.global.log(`in makeChat's method`);
    this.openChatPage();
  }

  openChatPage() {
    this.event.publish('select-page', 'chat');
  }

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  getSearchResult(query: any) {
    this.global.postRequest(this.global.base_path + '', {})
      .subscribe(
        res => {
          this.global.log(`getSearchResult data`, res);
          if (res.success == 'true') {
            this.userList = res;
          } else {
            this.global.log(`getSearchResult error`, res);
            this.global.showToast(res.error);
          }
        }, err => {
          this.global.log(`getSearchResult error`, err);
        });
  }

  valueChange(ev) {
    this.global.log(`in valueChange`, ev);
    this.getSearchResult(ev);
  }
}
