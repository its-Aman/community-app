import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-community-app-name',
  templateUrl: 'community-app-name.html',
})
export class CommunityAppNamePage {
  noData: boolean;
  userList: any;
  search: FormControl = new FormControl();
  searchType: any = 'Profession';
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public event: Events,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
  ) {
    this.getSearchResultByDropdown(true);

    this.search.valueChanges.
      debounceTime(300).subscribe(
        res => {
          this.global.cLog(`in value change and the value is `, res);
          if (res && res.length) {

            this.global.postRequest(this.global.base_path + 'Login/SerachTextBox', { searchby: this.searchType, searchtext: res })
              .subscribe(
                res => {
                  this.global.cLog(`getSearchResult data`, res);
                  if (res.success == 'true') {
                    this.userList = res;
                    if (this.userList.data && this.userList.data.length > 0) {
                      this.noData = false;
                    } else {
                      this.noData = true;
                    }
                  } else {
                    this.noData = true;
                    this.global.cLog(`getSearchResult error`, res);
                    this.global.showToast(res.error);
                  }
                }, err => {
                  this.noData = true;
                  this.global.cLog(`getSearchResult error`, err);
                });
          } else {
            this.getSearchResultByDropdown(true);
          }
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityAppNamePage');

    this.keyboard.onKeyboardHide().subscribe(
      res => {
        this.global.cLog(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });

    this.keyboard.onKeyboardShow().subscribe(
      res => {
        this.global.cLog(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });
  }

  personDetails(person: any) {
    this.global.cLog(`in personDetails's method`, person);
  }

  makeCall(person: any) {
    this.global.cLog(`in makeCall's method`, person);
    document.location.href = 'tel:' + person.mobile_no;
  }

  makeMail(person: any) {
    this.global.cLog(`in makeMail's method`, person);
    document.location.href = `mailto:${person.email}?subject=Dear%20Community%20Member%20${person.name}%20`;
  }

  makeChat(person: any) {
    this.global.cLog(`in makeChat's method`, person);
    this.openChatPage(person);
  }

  openChatPage(person: any) {
    this.navCtrl.push('ChatPage', { data: person });
  }

  removePadding() {
    this.global.cLog(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.cLog(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  getSearchResultByDropdown(isFirst: boolean) {
    isFirst ? null : this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/SerachByUsers', { searchby: this.searchType })
      .subscribe(
        res => {
          isFirst ? null : this.global.hideLoader();
          this.global.cLog(`getSearchResult data`, res);
          if (res.success == 'true') {
            this.userList = res;
            if (this.userList.data && this.userList.data.length > 0) {
              this.noData = false;
              this.userList.data.forEach((val, i) => {
                this.userList.data[i]['show'] = false;
              });
            } else {
              this.noData = true;
            }
          } else {
            this.noData = true;
            this.global.cLog(`getSearchResult error`, res);
            this.global.showToast(res.error);
          }
        }, err => {
          this.noData = true;
          isFirst ? null : this.global.hideLoader();
          this.global.cLog(`getSearchResult error`, err);
        });
  }

  valueChange(ev) {
    this.global.cLog(`in valueChange`, ev);
    this.search.setValue('');
    this.getSearchResultByDropdown(false);
  }

  openPeopleDetails(_i: number) {
    this.userList.data.forEach((user, i) => {
      if (i == _i) {
        this.userList.data[i].show = !this.userList.data[i].show;
      } else {
        this.userList.data[i].show = false;
      }
    });
  }

}
