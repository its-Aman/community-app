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
  persons: any[] = [{ name: null, age: '', amount: '' }];
  performanceList: any[] = [];
  person: any = {
    performanceName: '',
    noOfParticipants: '0',
    specialNeed: '',
  };
  previousPageData: any;
  showDescription: boolean = false;
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

    if (+this.previousPageData.event.entry_for != 0) {
      this.getPerformanceDetails();
    }
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

  initForm() {
    this.userForm = this.fb.group({
      name: [JSON.parse(localStorage.getItem('user')).name, [Validators.required]],
      mobile: [JSON.parse(localStorage.getItem('user')).mobileno, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      noOfMembers: [1, [Validators.required]]
    });
  }

  numberValue(range, isIncreased: boolean) {
    this.global.cLog('range is', range);
    if (+this.event.evententrydetail.payment_status == 0) {
      if (range) {
        this.userForm.controls['noOfMembers'].setValue(range);
        if (isIncreased) {
          this.persons.push({ name: null, age: null, amount: null });
        } else if (this.persons.length > 0) {
          this.persons.pop();
        }
        this.calcTotal();
      }
    } else {
      this.global.cLog('in else range is', this.persons.length);
    }
  }

  eventPersonChange(ev: any) {
    this.global.cLog(`eventPersonChange's event is ${ev}`);
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

    this.global.cLog(`in calculateEventPerson and returning`, _ret);
    return _ret + '';
  }

  submit(isPop: boolean) {
    this.global.cLog(`submit's method`, this.person, this.userForm, this.calculateEventPerson());

    // if (this.userForm.valid) {
    //   if (this.persons.length > 0) {
    //     if (this.person.noOfParticipants > 0) {
    let data = {
      event_entry_id: this.previousPageData.event_entry_id,
      event_id: this.previousPageData.event.id,
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      name: this.userForm.controls['name'].value,
      mobile_no: this.userForm.controls['mobile'].value,
      no_of_members: this.userForm.controls['noOfMembers'].value + '',
      entry_for: this.calculateEventPerson(),
      event_performance_id: this.performance ? this.person.performanceName : null,
      no_of_participants: this.performance ? this.person.noOfParticipants + '' : null,
      special_needs: this.performance ? this.person.specialNeed : null,
      members: this.persons,
    }

    this.global.cLog(`data to be posting is `, data);
    this.editEvent(data, isPop);

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
    this.global.cLog(`openCalendar's method`);
  }

  cancel() {
    this.global.cLog(`cancel's method`);

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
      event_entry_id: this.previousPageData.event_entry_id,
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
            this.global.cLog(`some error in else's cancel `, res);
            this.global.cLog(res.error);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`some error in cancel `, err);
        }
      )
  }

  change(ip, col) {
    this.global.cLog('this.ip is ', ip, col);
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
    this.global.cLog(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.cLog(`'in keyboard hide res`, contentNative, foo);
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
              this.persons.splice(i, 1)[0].name ? this.submit(false) : null;
              this.calcTotal();
            }
          }
        }
      ]
    });
    alert.present();
  }

  checkAge(i) {
    this.removePadding();
    this.global.cLog(String(this.persons[i].age));

    this.persons[i].age = this.persons[i].age.split(/ /)[0].replace(/[^\d]/g, '');

    if (String(this.persons[i].age).length >= 1 && this.persons[i].age == 0) {
      this.persons[i].age = ' ';
      this.global.showToast(`Age can't be zero`);
      return;
    }

    if (String(this.persons[i].age).length > 3) {
      this.persons[i].age = String(this.persons[i].age).slice(0, 3);
      return;
    }

    if (String(this.persons[i].age).length >= 0) {
      this.global.cLog(`checkAge`, this.persons[i]);
      this.getAmountAccToAge(this.persons[i].age, i);
    }
  }

  editEvent(data: any, isPop: boolean) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/EditEvent`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`response of register event`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            if (isPop) {
              this.navCtrl.pop();
            }
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`error of edit event`, err);
        });
  }

  getPerformanceList() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/PerformanceList`, { event_id: this.previousPageData.event.id })
      .subscribe(
        res => {
          // this.global.hideLoader();
          this.getEditEventDetail(false);
          this.global.cLog(`response of getPerformanceList`, res);
          if (res.success == 'true' && res.performance.length > 0) {
            this.performanceList.push(...res.performance);
            this.person.performanceName = +res.performance[0].id;
          } else {
            this.global.cLog(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`error of getPerformanceList`, err);
        });
  }

  getAmountAccToAge(age: number, i) {
    // this.global.showLoader();
    if (+this.previousPageData.event.price_type == 0) {
      this.persons[i].amount = this.previousPageData.event.standard_price;
      this.calcTotal();
    } else {
      this.global.postRequest(`${this.global.base_path}Login/GetAgeAmount`, { event_id: this.previousPageData.event.id, age: age })
        .subscribe(
          res => {
            // this.global.hideLoader();
            this.global.cLog(`response of getAmountAccToAge`, res);
            if (res.success == 'true') {
              this.persons[i].amount = res.amount;
              this.calcTotal();
            } else {
              this.global.showToast(`${res.error}`);
            }
          }, err => {
            // this.global.hideLoader();
            this.global.cLog(`error of getAmountAccToAge`, err);
          });
    }
  }

  getEditEventDetail(showLoader: boolean) {
    if (showLoader) {
      this.global.showLoader();
    }
    this.global.postRequest(`${this.global.base_path}Login/GetEditEventDetail`, { event_id: this.previousPageData.event_entry_id, login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`response of getEditEventDetail`, res);
          if (res.success == 'true') {
            this.event = res;
            this.setData(res.evententrydetail);
            this.calcTotal();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`error of getAmountAccToAge`, err);
        });
  }

  setData(data: any) {
    this.userForm.controls['name'].setValue(data.name);
    this.userForm.controls['mobile'].setValue(data.mobile_no);
    this.userForm.controls['noOfMembers'].setValue(data.members.length);

    if (data.entry_for == 3) {
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

    this.person.performanceName = +data.event_performance_id;
    this.person.noOfParticipants = +data.no_of_participants;
    this.person.specialNeed = data.special_needs;
    this.persons = [];
    data.members.forEach(member => {
      this.persons.push({ age: member.age, name: member.name, amount: member.amount });
    });
    if (+this.event.evententrydetail.payment_status == 1) {
      this.event.evententrydetail.qrcode_image = `${this.global.image_base_path}barcode/${this.event.evententrydetail.qrcode_image}`;
      this.global.cLog(`in qrimage`, this.event.qrcode_image)
    }
  }

  calcTotal() {
    this.total = 0;
    if (this.persons.length > 0) {
      this.persons.forEach(data => {
        this.total += +data.amount;
      });
    }

    this.userForm.controls['noOfMembers'].setValue(this.persons.length);
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
        this.global.cLog('some error in searchUser api', err);
      });
  }

  searchingUser(name: string, i: number) {
    this.global.cLog('in searching user');
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
    this.global.cLog(`in itemSelect`, item);
    this.persons[this._index].name = item.name;
    this._index = null;
    this.users = [];
  }

  openScanner() {
    this.global.cLog(`in openScanner`);
    this.navCtrl.push('ScanQrCodePage', { data: null });
  }

  ageValidation(event: any, i: number) {
    this.global.cLog(`in (keyup)="ageValidation()" `, event, event.target.value, event.target.value.toString().length);
    if (event.target.value.toString().length > 3) {
      this.persons[i].age = this.persons[i].age.toString().slice(0, 3);
    }
  }

  getPerformanceDetails() {
    let data = {
      user_id: JSON.parse(localStorage.getItem('user')).id,
      event_id: this.event.event.id
    }

    this.global.postRequest(this.global.base_path + 'Login/GetPerticularPerformanceofUser', data)
      .subscribe(
        res => {
          this.global.cLog(`getPerformanceDetails response is`, res);
          if (res.success == 'true') {
            this.performance = true;
            // this.performanceDetails = res.performancedetail;
            this.person.performanceName = +res.performanceDetails.event_performance_id;
            this.person.noOfParticipants = +res.performanceDetails.no_of_participants;
            this.person.specialNeed = res.performanceDetails.special_needs;

          } else {
            this.global.cLog(`some error in getPerformanceDetails`, res);
            this.global.showToast(res.error);
          }
        }, err => {
          this.global.cLog(`some error in getPerformanceDetails `, err);
        }
      )
  }

}
