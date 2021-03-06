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

  enterButton: boolean = false;
  OtpVerify: any;
  isFormInvalid: boolean;
  forgotPinForm: FormGroup;
  resending: any = { time: 50, value: false };
  resendText: string = 'Re-send OTP';

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
    });

    this.forgotPinForm.controls['otp'].valueChanges.subscribe(res => {
      if (res && res.length > 10) {
        this.forgotPinForm.controls['otp'].setValue(this.forgotPinForm.controls['otp'].value.slice(0, 10));
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

  removePadding() {
    this.global.cLog(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.cLog(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  initForm() {
    this.forgotPinForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      otp: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    });
  }

  resendOTP() {
    this.global.cLog('Resend OTP');
    // this.navCtrl.setRoot('ChangePinPage', { fromLogin: true });
    if (!this.resending.value) {

      if (this.forgotPinForm.controls['mobile'].value && this.forgotPinForm.controls['mobile'].value.length == 11) {
        this.enterButton = true;
        if (this.resending.time == 50) {
          if (this.resendText == 'Send OTP') {
            this.resendText = 'Re-send OTP';
          }
          this.requestOTP({ mobile: `${this.forgotPinForm.controls['mobile'].value}` }, true);
        }
      } else {
        this.global.showToast(`Mobile number not correct`);
      }
    }
  }

  requestOTP(data: any, isResend: boolean = false) {
    this.global.showLoader();
    // this.global.postRequest(`${this.global.base_path}Login/RegisterRequestOtp`, data)
    this.global.postRequest(`${this.global.base_path}Login/ForgetPass`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`res is `, res);
          if (res.success == 'true') {
            localStorage.setItem('user_id', res.user_id);
            this.global.showToast(`${res.message}`);
            if (isResend) {
              this.resending.value = true;
              let interval = setInterval(() => {
                this.global.cLog(`in setInterval`, this.resending);
                this.resending.time--;
                if (this.resending.time < 0) {
                  this.resending.value = false;
                  this.resending.time = 50;
                  clearInterval(interval);
                }
              }, 1000);
            }
          } else {
            if (res.error == 'Mobile Number is already Registered.') {
              this.global.showToast(`${res.error} Try logging in.`);
              this.OtpVerify = res;
            } else {
              this.global.showToast(`${res.error}`);
            }
          }
        },
        err => {
          this.global.hideLoader();
          this.global.cLog(`err is `, err);
        }
      );
  }

  sendOTP() {
    this.global.cLog(`in sendOTP`)
    if (this.forgotPinForm.valid) {
      this.global.cLog('form is valid', this.forgotPinForm);
      this.verifyOTP(this.forgotPinForm.value);
    } else {
      this.isFormInvalid = true;
    }
  }

  verifyOTP(data: any) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/ForgotPinOtpVerify`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`OtpVerify response`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}, Set new pin now.`);
            this.OtpVerify = res;
            // localStorage.setItem('otp-res-value', JSON.stringify(res));
            setTimeout(() => {
              // this.signInData = true;
              // this.signUpForm.controls['mobile'].setValue(data.mobile);
              this.navCtrl.setRoot('ChangePinPage', { fromLogin: true });
            }, 500);
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`OtpVerify error`, err);
        });
  }
}
