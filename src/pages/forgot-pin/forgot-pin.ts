import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';

@IonicPage()
@Component({
  selector: 'page-forgot-pin',
  templateUrl: 'forgot-pin.html',
})
export class ForgotPinPage {

  isFormInvalid: boolean;
  forgotPinForm: FormGroup;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
    public events: Events, ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPinPage');

    this.forgotPinForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 11) {
        this.forgotPinForm.controls['mobile'].setValue(this.forgotPinForm.controls['mobile'].value.slice(0, 11));
      }
      if (res && res.length == 11) {
        this.global.log('mobile res is', res);
        // this.requestOTP({ mobile: `${res}` });
      }
    });

    // this.forgotPinForm.controls['otp'].valueChanges.subscribe(res => {
    //   if (res && res.length > 10) {
    //     this.forgotPinForm.controls['otp'].setValue(this.forgotPinForm.controls['otp'].value.slice(0, 10));
    //   }
    // });

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

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  initForm() {
    this.forgotPinForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      // otp: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });
  }

  sendOTP() {
    this.global.log(`in sendOTP`, this.forgotPinForm);

    if (this.forgotPinForm.valid) {

      this.global.showLoader();
      this.global.postRequest(`${this.global.base_path}Login/ForgetPass`, { Mobile: this.forgotPinForm.controls['mobile'].value })
        .subscribe(
          res => {
            this.global.hideLoader();
            this.global.log(`res is `, res);
            if (res.success == 'true') {
              this.global.showToast(`${res.message}`);
              setTimeout(() => {
                this.navCtrl.setRoot('LoginPage');
                // this.navCtrl.setRoot('ChangePinPage');
              }, 2000);
            } else {
              this.global.showToast(`${res.error}`);
            }
          },
          err => {
            this.global.hideLoader();
            this.global.log(`err is `, err);
          }
        );
    } else {
      this.isFormInvalid = true;
    }
  }
}
