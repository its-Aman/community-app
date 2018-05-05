import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-community-app-name',
  templateUrl: 'community-app-name.html',
})
export class CommunityAppNamePage {
  search: any;
  searchType: any = 'P';
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public event: Events,
    public keyboard: Keyboard,
  ) {
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
}
