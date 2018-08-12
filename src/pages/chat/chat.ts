import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  noData: boolean;
  page: number = 1;
  chatData: any[] = [];

  dummyChat: any[];
  inputText: string;
  chatListData: any;
  userDetails: any;
  user_image: string;
  fromChatList: boolean = false;

  @ViewChild('content') content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public global: GlobalProvider,
    public zone: NgZone,
    ) {
    // this.fillDummyChat();
    this.chatListData = this.navParams.get('data');
    this.fromChatList = this.navParams.get('fromChatList') || false;
    if (this.fromChatList) {
      this.chatListData["id"] = this.chatListData.other_user_id;
    } else {
      if (this.chatListData.user_image) {
        this.chatListData.user_image = `${this.global.image_base_path}user/${this.chatListData.user_image}`;
      } else {
        this.chatListData.user_image = this.global.defaultImage;
      }
    }

    this.getChatData();
    this.listenForPushMessages();
  }

  listenForPushMessages() {
    this.events.subscribe('chatPageData', data => {
      this.global.cLog(`got the push data`, data, this.chatData);

      //do the logic

      this.zone.run(()=>{
        this.chatData.push(data);
        this.global.cLog(`chat data after push`, this.chatData);
        this.scrollToBottom();
      })
    });
  }

  ionViewDidEnter() {
    localStorage.setItem('chatPage', "true");
  }

  ionViewDidLeave() {
    this.events.unsubscribe('chatPageData');
    localStorage.removeItem('chatPage');
  }

  ionViewDidLoad() {

    this.userDetails = JSON.parse(localStorage.getItem('user'));

    if (this.userDetails.user_image) {
      this.user_image = this.global.image_base_path + 'user/' + this.userDetails.user_image;
    } else {
      this.user_image = this.global.defaultImage;
    }

    console.log('ionViewDidLoad ChatPage', this.chatListData, this.fromChatList);

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
    this.global.cLog('Sending message');

    this.inputText = this.inputText.trim();
    if (this.inputText.length > 0) {
      let pushData = {
        entry_date_time: new Date().toISOString(),
        from_user_id: JSON.parse(localStorage.getItem('user')).id,
        message: this.inputText,
        to_user_id: this.chatListData.id,
      };

      let postData = {
        to_user_id: this.chatListData.id,
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
      to_user_id: this.chatListData.id,
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      page: this.page
    }
    this.global.postRequest(`${this.global.base_path}Login/Conversation`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`getChatData's response is`, res);

          if (res.success == 'true') {
            this.chatData = res.conversation;
            this.noData = false;
            this.scrollToBottom();
          } else {
            this.noData = true;
          }
        }, err => {
          this.noData = true;
          this.global.hideLoader();
          this.global.cLog(`getChatData's error is`, err);
        }
      );
  }

  sendMessage(postData, pushData) {
    this.global.postRequest(`${this.global.base_path}Login/SendMessage`, postData)
      .subscribe(
        res => {
          this.global.cLog(`getChatData's response is`, res);

          if (res.success == 'true') {
            this.noData = false;
            pushData['id'] = res.id;
            this.chatData.push(pushData);
            this.inputText = '';
            this.scrollToBottom();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          // this.noData = true;
          this.global.cLog(`getChatData's error is`, err);
        }
      );
  }
}