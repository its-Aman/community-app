import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  total: number;
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
  ) {
    this.previousPageData = this.navParams.get('data');
    this.initForm();
    this.getPerformanceList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditEventPage', this.previousPageData);

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
    if (this.eventPerson.length == 0) {
      _ret = 0;
    } else if (this.eventPerson.length == 2) {
      _ret = 1;
    } else if (this.eventPerson.length == 1) {
      _ret = +this.eventPerson[0];
    }

    this.global.log(`in calculateEventPerson and returning`, _ret);
    return _ret;
  }

  submit() {
    this.global.log(`submit's method`, this.person, this.userForm, this.calculateEventPerson());

    if (this.userForm.valid) {
      if (this.persons.length > 0) {
        if (this.person.noOfParticipants > 0) {
          let data = {
            event_id: this.previousPageData.event.id,
            login_user_id: JSON.parse(localStorage.getItem('user')).id,
            name: this.userForm.controls['name'].value,
            mobile_no: this.userForm.controls['mobile'].value,
            no_of_members: this.userForm.controls['noOfMembers'].value,
            entry_for: this.calculateEventPerson(),
            event_performance_id: this.person.performanceName,
            no_of_participants: this.person.noOfParticipants,
            special_needs: this.person.specialNeed,
            members: this.persons,
          }

          this.global.log(`data to be posting is `, data);
          this.editEvent(data);

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

  cancel() {
    this.global.log(`cancel's method`);
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
      this.calcTotal();
    }
  }

  checkAge(i) {
    this.global.log(String(this.persons[i].age));

    if (String(this.persons[i].age).length >= 2) {
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
          this.global.log(`response of getPerformanceList`, res);
          if (res.success == 'true' && res.performance.length > 0) {
            this.performanceList.push(...res.performance);
            this.person.performanceName = res.performance[0].id;
            this.getEditEventDetail();
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
    this.global.postRequest(`${this.global.base_path}Login/GetAgeAmount`, { event_id: this.previousPageData.event.id, age: age })
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

  getEditEventDetail() {
    // this.global.showLoader();
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
    this.eventPerson = data.entry_for >= 4 ? data.entry_for - 1 : data.entry_for;
    this.person.performanceName = data.event_performance_id;
    this.person.noOfParticipants = data.no_of_participants;
    this.person.specialNeed = data.special_needs;
    this.persons = data.members;
  }

  calcTotal() {
    this.total = 0;
    if (this.persons.length > 0) {
      this.persons.forEach(data => {
        this.total += +data.amount;
      });
    }
  }
}
