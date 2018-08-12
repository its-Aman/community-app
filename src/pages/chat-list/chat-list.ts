import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  noData: boolean;
  chatList: any[];
  personList: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public events: Events,
  ) {
    // this.fillList();
    this.events.subscribe('select-page', data => {
      setTimeout(() => {
        this.getChatListData(false);
        if (!localStorage.getItem('chatPage')) {
          data["id"] = data.from_sender_id;
          this.navCtrl.push('ChatPage', { data: data });
        }
      }, 250);
    });

    this.getChatListData(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatListPage');
  }

  fillList() {
    this.personList = [
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Linda Natasha',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Steven Swap',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Carza Heldon',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Richard Steve',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Natasha Chaw',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Natasha Chaw',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
      {
        image: 'assets/icon/sidebar-profile-photo.png',
        name: 'Linda Natasha',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        time: new Date(),
      },
    ];
  }

  openChatDetails(person, i) {
    this.navCtrl.push('ChatPage', { data: this.chatList[i], fromChatList: true });
  }

  edit() {
    this.global.cLog(`in edit()`);
  }

  getChatListData(showLoader: boolean) {
    showLoader ? this.global.showLoader() : null;
    this.global.postRequest(`${this.global.base_path}Login/Chatlist`, { login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          showLoader ? this.global.hideLoader() : null;
          this.global.cLog(`getChatListData's response is`, res);

          if (res.success == 'true') {
            this.chatList = res.chatlist;
            if (this.chatList.length > 0) {
              this.noData = false;
              this.chatList.forEach(element => {
                if (element.image) {
                  element.image = `${this.global.image_base_path}user/${element.image}`;
                } else {
                  element.image = this.global.defaultImage;
                }
                element["user_image"] = element.image;
              });
            } else {
              this.noData = true;
            }
          } else {
            this.noData = true;
          }
        }, err => {
          showLoader ? this.global.hideLoader() : null;
          this.global.cLog(`getChatListData's error is`, err);
        }
      )
  }
}
