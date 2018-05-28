import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  noData: boolean;
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
    // this.fillDummyChat();
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
      let pushData = {
        from_user_id: JSON.parse(localStorage.getItem('user')).id,
        image: 'assets/icon/sidebar-profile-photo.png',
        message: this.inputText,
        entry_date_time: new Date(),
      };

      let postData = {
        to_user_id: this.chatListData.other_user_id,
        login_user_id: JSON.parse(localStorage.getItem('user')).id,
        message: this.inputText,
      }

      this.sendMessage(postData, pushData);
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
      to_user_id: this.chatListData.other_user_id,
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
            this.noData = false;
          } else {
            this.noData = true;
          }
        }, err => {
          this.noData = true;
          this.global.hideLoader();
          this.global.log(`getChatData's error is`, err);
        }
      );
  }

  sendMessage(postData, pushData) {
    this.global.postRequest(`${this.global.base_path}Login/SendMessage`, postData)
      .subscribe(
        res => {
          this.global.log(`getChatData's response is`, res);

          if (res.success == 'true') {
            pushData['id'] = res.id;
            this.chatData.push(pushData);
            this.inputText = '';
            this.scrollToBottom();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.noData = true;
          this.global.log(`getChatData's error is`, err);
        }
      );
  }
}