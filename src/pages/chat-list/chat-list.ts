import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  personList: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fillList();
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
    this.navCtrl.push('ChatPage', { data: null });
  }
}
