import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;

  dummyChat: any[];
  inputText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider
  ) {
    this.fillDummyChat();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');

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
}