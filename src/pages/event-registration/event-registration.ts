import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-event-registration',
  templateUrl: 'event-registration.html',
})
export class EventRegistrationPage {

  i: number;
  users: any[];
  searchedUser: any[];
  previousPageData: any;
  total: number = 0;
  event: any;
  eventPerson: string[] = [];
  userForm: FormGroup;
  isFormInvalid: boolean = false;
  persons: any[] = [{ name: null, age: null, amount: null }];
  performanceList: any[] = [];
  person: any = {
    performanceName: '',
    noOfParticipants: '0',
    specialNeed: '',
  }

  volunteer = true;
  performance = true;

  @ViewChild(Content) content: Content;
  @ViewChild('extra') extra: TextInput;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
  ) {
    this.event = this.navParams.get('data');
    this.previousPageData = this.navParams.get('data');

    this.initForm();
    this.getPerformanceList();
    
  //   this.searchedUser = [
  //     {
  //         "id": "33",
  //         "name": ""
  //     },
  //     {
  //         "id": "32",
  //         "name": ""
  //     },
  //     {
  //         "id": "31",
  //         "name": ""
  //     },
  //     {
  //         "id": "30",
  //         "name": "Deepshikha Soni"
  //     },
  //     {
  //         "id": "29",
  //         "name": ""
  //     },
  //     {
  //         "id": "28",
  //         "name": ""
  //     },
  //     {
  //         "id": "27",
  //         "name": ""
  //     },
  //     {
  //         "id": "26",
  //         "name": ""
  //     },
  //     {
  //         "id": "25",
  //         "name": ""
  //     },
  //     {
  //         "id": "24",
  //         "name": ""
  //     },
  //     {
  //         "id": "23",
  //         "name": ""
  //     },
  //     {
  //         "id": "2",
  //         "name": "fname"
  //     }
  // ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventRegistrationPage', this.event);

    this.userForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 10) {
        this.userForm.controls['mobile'].setValue(this.userForm.controls['mobile'].value.slice(0, 10));
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
      name: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
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
    /*
        if (this.eventPerson.length == 0) {
          _ret = 0;
        } else if (this.eventPerson.length == 2) {
          _ret = 1;
        } else if (this.eventPerson.length == 1) {
          _ret = +this.eventPerson[0];
        }
    */
    this.global.log(`in calculateEventPerson and returning`, _ret);
    return _ret;
  }

  submit() {
    this.global.log(`submit's method`, this.person, this.userForm, this.calculateEventPerson());

    if (this.userForm.valid) {
      if (this.persons.length > 0) {
        if (this.person.noOfParticipants > 0) {
          let data = {
            event_id: this.event.event.id,
            login_user_id: JSON.parse(localStorage.getItem('user')).id,
            name: this.userForm.controls['name'].value,
            mobile_no: this.userForm.controls['mobile'].value,
            no_of_members: this.userForm.controls['noOfMembers'].value,
            event_performance_id: this.person.performanceName,
            entry_for: this.calculateEventPerson(),
            no_of_participants: this.person.noOfParticipants,
            special_needs: this.person.specialNeed,
            members: this.persons,
            // event_entry_id: this.event.event_entry_id,
          }

          this.global.log(`data to be posting is `, data);
          this.registerEvent(data);

        } else {
          this.global.showToast(`Number of participants can't be zero`);
        }
      } else {
        this.global.showToast('Please enter the members details');
      }
    } else {
      this.global.showToast('Please enter the values');
      this.isFormInvalid = true;
    }
  }

  openCalendar() {
    this.global.log(`openCalendar's method`);
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
    if (this.persons.length > 0) {
      this.persons.splice(i, 1);
    }
  }

  checkAge(i, ev) {
    this.global.log(ev.target.value);
    if (ev.target.value && ev.target.value.length >= 2) {
      this.global.log(`checkAge`, ev.target.value);
      this.getAmountAccToAge(+ev.target.value, i);
    }
  }

  registerEvent(data: any) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/EventRegistration`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of register event`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.navCtrl.pop();
          } else {
            this.global.showToast(`${res.error}`);
            if (res.error == "User Already Registered with this event.") {
              this.navCtrl.pop();
            }
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of register event`, err);
        });
  }

  getPerformanceList() {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/PerformanceList`, { event_id: this.event.event.id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`response of getPerformanceList`, res);
          if (res.success == 'true' && res.performance.length > 0) {
            this.performanceList.push(...res.performance);
            this.person.performanceName = res.performance[0].id;
            this.searchUser();

          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`error of getPerformanceList`, err);
        });
  }

  getAmountAccToAge(age: number, i) {
    // this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/GetAgeAmount`, { event_id: this.event.event.id, age: age })
      .subscribe(
        res => {
          // this.global.hideLoader();
          this.global.log(`response of getAmountAccToAge`, res);
          if (res.success == 'true') {
            this.persons[i].amount = +res.amount;
            this.calcTotal();
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          // this.global.hideLoader();
          this.global.log(`error of getAmountAccToAge`, err);
        });
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
    this.global.showLoader();
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
    this.i = i;

    if (name.length > 0) {
      this.users = [];      
      this.searchedUser.forEach((user: any) => {
        if (user.name && user.name.includes(name)) {
          this.users.push(user);
        }
      });
    } else {
      this.users = [];
    }

  }

  itemSelected(item) {
    this.persons[this.i].name = item.name;
    this.i = null;
    this.users = [];
  }
}
