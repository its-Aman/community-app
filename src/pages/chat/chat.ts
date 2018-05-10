import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  page: number = 1;
  chatData: any[];
  @ViewChild('content') content: Content;

  dummyChat: any[];
  inputText: string;
  chatListData: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
    this.fillDummyChat();
    this.chatListData = this.navParams.get('data');
    this.getChatData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage', this.chatListData);

    this.scrollToBottom(250);
  }

  fillDummyChat() {
    this.dummyChat = [
      {
        isMe: false,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        time: new Date()
      },
      {
        isMe: true,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        time: new Date()
      },
      {
        isMe: false,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        time: new Date()
      },
      {
        isMe: true,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        time: new Date()
      },
      {
        isMe: false,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        time: new Date()
      }
    ];
  }

  send() {
    this.global.log('Sending message');

    this.inputText = this.inputText.trim();
    if (this.inputText.length > 0) {
      this.dummyChat.push({
        isMe: true,
        userImage: 'assets/icon/sidebar-profile-photo.png',
        message: this.inputText,
        time: new Date()
      });
      this.inputText = '';
      this.scrollToBottom();
    }
  }

  scrollToBottom(timeout: number = 0) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, timeout);
  }

  getChatData() {
    this.global.showLoader();
    let data = {
      to_user_id: this.chatListData.id,
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      page: this.page
    }
    this.global.postRequest(`${this.global.base_path}Login/Conversation`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`getChatData's response is`, res);

          if (res.success == 'true') {
            this.chatData = res.conversation;
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`getChatData's error is`, err);
        }
      )
  }
}