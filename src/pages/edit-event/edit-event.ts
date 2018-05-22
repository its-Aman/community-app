import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  users: any[];
  _index: number;
  searchedUser: any;
  total: number;
  event: any;
  performance: boolean = false;
  volunteer: boolean = false;
  userForm: FormGroup;
  isFormInvalid: boolean = false;
  persons: any[] = [{ name: null, age: null, amount: null }];
  performanceList: any[] = [];
  person: any = {
    performanceName: '',
    noOfParticipants: '0',
    specialNeed: '',
  };
  previousPageData: any;
  @ViewChild(Content) content: Content;
  @ViewChild('extra') extra: TextInput;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
    public alrtCtrl: AlertController,
  ) {
    this.previousPageData = this.navParams.get('data');
    this.initForm();
    if (+this.previousPageData.event.entry_for == 1 || +this.previousPageData.event.entry_for == 3) {
      this.getPerformanceList();
    } else {
      this.getEditEventDetail(true);
    }
    this.searchUser();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage', this.previousPageData);

    this.userForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 11) {
        this.userForm.controls['mobile'].setValue(this.userForm.controls['mobile'].value.slice(0, 11));
      }
    });

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

  initForm() {
    this.userForm = this.fb.group({
      name: [JSON.parse(localStorage.getItem('user')).name, [Validators.required]],
      mobile: [JSON.parse(localStorage.getItem('user')).mobileno, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      noOfMembers: [1, [Validators.required]]
    });
  }

  numberValue(range, isIncreased: boolean) {
    this.global.log('range is', range);
    if (range) {
      this.userForm.controls['noOfMembers'].setValue(range);
      if (isIncreased) {
        this.persons.push({ name: null, age: null, amount: null });
      } else if (this.persons.length > 0) {
        this.persons.pop();
      }
      this.calcTotal();
    }
  }

  eventPersonChange(ev: any) {
    this.global.log(`eventPersonChange's event is ${ev}`);
  }

  calculateEventPerson() {
    let _ret: number = 0;

    if (this.volunteer && this.performance) {
      _ret = 1;
    } else if (this.volunteer) {
      _ret = 2;
    } if (this.performance) {
      _ret = 3;
    }

    // if (this.performance.length == 0) {
    //   _ret = 0;
    // } else if (this.performance.length == 2) {
    //   _ret = 1;
    // } else if (this.performance.length == 1) {
    //   _ret = +this.performance[0];
    // }

    this.global.log(`in calculateEventPerson and returning`, _ret);
    return _ret + '';
  }

  submit() {
    this.global.log(`submit's method`, this.person, this.userForm, this.calculateEventPerson());

    // if (this.userForm.valid) {
    //   if (this.persons.length > 0) {
    //     if (this.person.noOfParticipants > 0) {
    let data = {
      event_id: this.previousPageData.event.id,
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      name: this.userForm.controls['name'].value,
      mobile_no: this.userForm.controls['mobile'].value,
      no_of_members: this.userForm.controls['noOfMembers'].value + '',
      entry_for: this.calculateEventPerson(),
      event_performance_id: this.performance ? this.person.performanceName : null,
      no_of_participants: this.performance ? this.person.noOfParticipants : null,
      special_needs: this.performance ? this.person.specialNeed : null,
      members: this.persons,
    }

    this.global.log(`data to be posting is `, data);
    this.editEvent(data);

    //     } else {
    //       this.global.showToast(`Number of participants can't be zero`);
    //     }
    //   } else {
    //     this.global.showToast('Please enter the members details');
    //   }
    // } else {
    //   this.global.showToast('Please enter the values');
    //   this.isFormInvalid = true;
    // }
  }


  openCalendar() {
    this.global.log(`openCalendar's method`);
  }

  cancel() {
    this.global.log(`cancel's method`);

    let alert = this.alrtCtrl.create({
      title: 'Cancel this Event ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.cancelEvent();
          }
        }
      ]
    });
    alert.present();
  }

  cancelEvent() {
    let data = {
      event_id: this.previousPageData.event.id,
      user_id: JSON.parse(localStorage.getItem('user')).id
    }
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/CancleEventEntry', data)
      .subscribe(
        res => {
          this.global.hideLoader();
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.navCtrl.pop();
          } else {
            this.global.log(`some error in else's cancel `, res);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`some error in cancel `, err);
        }
      )
  }

  change(ip, col) {
    this.global.log('this.ip is ', ip, col);
    if (ip) {

      let element = ip._elementRef.nativeElement;

      let textarea: HTMLElement = element.getElementsByTagName('textarea')[0];

      // set default style for textarea
      textarea.style.minHeight = '0';
      textarea.style.height = '0';

      // limit size to 96 pixels (6 lines of text)
      let scroll_height = textarea.scrollHeight;
      if (scroll_height > 80) {
        scroll_height = 80;
      }

      // apply new style
      if (scroll_height > 49) {
        col.style.height = scroll_height + 20 + 'px';
      } else {
        col.style.height = '50px';
      }
      element.style.height = scroll_height + 20 + "px";
      textarea.style.minHeight = scroll_height + "px";
      textarea.style.height = scroll_height + "px";
    }
  }

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  removeItem(i: number) {
    let alert = this.alrtCtrl.create({
      title: 'Are you sure you want to delete this member ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.persons.length > 0) {
              this.persons.splice(i, 1);
              this.calcTotal();
            }
          }
        }
      ]
    });
    alert.present();
  }

  checkAge(i) {
    this.global.log(String(this.persons[i].age));

    if (String(this.persons[i].age).length >= 1) {
      this.global.log(`checkAge`, this.persons[i]);
      this.getAmountAccToAge(this.persons[i].age, i);
    }
  }

  editEvent(data: any) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/EditEvent`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of register event`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.navCtrl.pop();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of register event`, err);
        });
  }

  getPerformanceList() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/PerformanceList`, { event_id: this.previousPageData.event.id })
      .subscribe(
        res => {
          // this.global.hideLoader();
          this.getEditEventDetail(false);
          this.global.log(`response of getPerformanceList`, res);
          if (res.success == 'true' && res.performance.length > 0) {
            this.performanceList.push(...res.performance);
            this.person.performanceName = res.performance[0].id;
          } else {
            this.global.log(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of getPerformanceList`, err);
        });
  }

  getAmountAccToAge(age: number, i) {
    // this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/GetAgeAmount`, { event_id: this.previousPageData.event.id, age: age })
      .subscribe(
        res => {
          // this.global.hideLoader();
          this.global.log(`response of getAmountAccToAge`, res);
          if (res.success == 'true') {
            this.persons[i].amount = res.amount;
            this.calcTotal();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          // this.global.hideLoader();
          this.global.log(`error of getAmountAccToAge`, err);
        });
  }

  getEditEventDetail(showLoader: boolean) {
    if (showLoader) {
      this.global.showLoader();
    }
    this.global.postRequest(`${this.global.base_path}Login/GetEditEventDetail`, { event_id: this.previousPageData.event.id, login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of getEditEventDetail`, res);
          if (res.success == 'true') {
            this.event = res;
            this.setData(res.evententrydetail);
            this.calcTotal();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of getAmountAccToAge`, err);
        });
  }

  setData(data: any) {
    this.userForm.controls['name'].setValue(data.name);
    this.userForm.controls['mobile'].setValue(data.mobile_no);
    this.userForm.controls['noOfMembers'].setValue(data.no_of_members.length > data.members.length ? data.members.length : data.members.length);

    if (data.entry_for == 1) {
      this.volunteer = true;
      this.performance = true;
    } else if (data.entry_for == 2) {
      this.volunteer = true;
      this.performance = false;
    } else if (data.entry_for == 3) {
      this.volunteer = false;
      this.performance = true;
    } else if (data.entry_for == 0) {
      this.volunteer = false;
      this.performance = false;
    }

    this.person.performanceName = data.event_performance_id;
    this.person.noOfParticipants = data.no_of_participants;
    this.person.specialNeed = data.special_needs;
    this.persons = [];
    data.members.forEach(member => {
      this.persons.push({ age: member.age, name: member.name, amount: member.amount });
    });;
  }

  calcTotal() {
    this.total = 0;
    if (this.persons.length > 0) {
      this.persons.forEach(data => {
        this.total += +data.amount;
      });
    }
  }

  searchUser() {
    // this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/ListofUsers', {})
      .subscribe(res => {
        this.global.hideLoader();
        if (res.success == 'true') {
          this.searchedUser = res.users;
        }
      }, err => {
        this.global.hideLoader();
        this.global.log('some error in searchUser api', err);
      });
  }

  searchingUser(name: string, i: number) {
    this.global.log('in searching user');
    this._index = i;

    if (name.length > 0) {
      this.users = [];
      this.searchedUser.forEach((user: any) => {
        if (user.name && user.name.toLowerCase().includes(name.toLowerCase())) {
          this.users.push(user);
        }
      });
    } else {
      this.users = [];
    }

  }

  itemSelected(item) {
    this.global.log(`in itemSelect`, item);
    this.persons[this._index].name = item.name;
    this._index = null;
    this.users = [];
  }

}
