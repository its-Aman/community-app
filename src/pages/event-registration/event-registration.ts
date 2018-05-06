import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, TextInput } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-event-registration',
  templateUrl: 'event-registration.html',
})
export class EventRegistrationPage {

  event: any;
  eventPerson: string = 'V';
  userForm: FormGroup;
  isFormInvalid: boolean = false;
  persons: any[];
  person: any = {
    performanceName: 'bd',
    noOfParticipants: '09',
    specialNeed: 'Extra'
  }
  @ViewChild(Content) content: Content;
  @ViewChild('extra') extra: TextInput;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
  ) {
    this.initForm();
    this.persons = [
      { name: 'Ajay', age: 30, amount: '3000/-' },
      { name: 'Ajay', age: 30, amount: '3000/-' },
      { name: 'Ajay', age: 30, amount: '3000/-' },
      { name: 'Ajay', age: 30, amount: '3000/-' },
    ]
  }

  ionViewDidLoad() {
    this.event = this.navParams.get('data');
    this.event['description'] = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit`;
    console.log('ionViewDidLoad EventRegistrationPage', this.event);

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
      name: ['Aman Kumar', [Validators.required]],
      mobile: ['123456789', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      noOfMembers: [16, [Validators.required]]
    });
  }

  numberValue(range) {
    this.global.log('range is', range);
    if (range) {
      this.userForm.controls['noOfMembers'].setValue(range);
    }
  }

  eventPersonChange(ev: any) {
    this.global.log(`eventPersonChange's event is ${ev}`);
  }

  submit() {
    this.global.log(`submit's method`, this.person);
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

  // focusExtra(extra: TextInput) {
  //   this.global.log(`extra is`, extra, extra._elementRef.nativeElement.offsetTop);
  //   setTimeout(() => {
  //     this.content.scrollToBottom().then(r => this.global.log(`done scrolling`));
  //   }, 2000);
  // }

  // getOffset(el) {
  //   let _x = 0;
  //   let _y = 0;
  //   while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
  //     _x += el.offsetLeft - el.scrollLeft;
  //     _y += el.offsetTop - el.scrollTop;
  //     el = el.offsetParent;
  //   }
  //   return { top: _y, left: _x };
  // }

  removeItem(i: number) {
    if (this.persons.length > 0) {
      this.persons.splice(i, 1);
    }
  }
}
