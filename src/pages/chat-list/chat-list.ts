import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  ) {
    // this.fillList();
  }
  
  ionViewDidLoad() {
    this.getChatListData();
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
    this.navCtrl.push('ChatPage', { data: this.chatList[i] });
  }

  edit() {
    this.global.log(`in edit()`);
  }

  getChatListData() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/Chatlist`, { login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`getChatListData's response is`, res);

          if (res.success == 'true') {
            this.chatList = res.chatlist;
            if (this.chatList.length > 0) {
              this.noData = false;
              this.chatList.forEach(element => {
                // element.image = this.global.sanatizeImage(`http://winstech.in/community/uploads/user/${element.image}`);
                element.image = `http://winstech.in/community/uploads/user/${element.image}`;
              });
            } else {
              this.noData = true;
            }
          } else {
            this.noData = true;
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`getChatListData's error is`, err);
        }
      )
  }
}
