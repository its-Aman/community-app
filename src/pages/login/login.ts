import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginRes: any;
  OtpVerify: any;
  resending: any = { time: 50, value: false };
  signInData: any;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  isFormInvalid: boolean = false;
  signInOtp: string;
  resendText: string = 'Send OTP';

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
  ) {
    this.initForm();
    this.signInData = this.navParams.get('signInData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.loginForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 10) {
        this.loginForm.controls['mobile'].setValue(this.loginForm.controls['mobile'].value.slice(0, 10));
      }
      if (res && res.length == 10) {
        this.global.log('mobile res is', res);
        // this.requestOTP({ mobile: `${res}` });
      }
    });

    this.loginForm.controls['otp'].valueChanges.subscribe(res => {
      if (res && res.length > 6) {
        this.loginForm.controls['otp'].setValue(this.loginForm.controls['otp'].value.slice(0, 6));
      }
    });

    this.signUpForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 10) {
        this.signUpForm.controls['mobile'].setValue(this.signUpForm.controls['mobile'].value.slice(0, 10));
      }
    });

    this.signUpForm.controls['pin'].valueChanges.subscribe(res => {
      if (res && res.length > 6) {
        this.signUpForm.controls['pin'].setValue(this.signUpForm.controls['pin'].value.slice(0, 6));
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

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  requestOTP(data: any, isResend: boolean = false) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/RegisterRequestOtp`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`res is `, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            if (isResend) {
              this.resending.value = true;
              let interval = setInterval(() => {
                this.global.log(`in setInterval`, this.resending);
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
          this.global.log(`err is `, err);
        }
      );
  }

  login_api(data: any) {
    // this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/Login`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`login response`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.loginRes = res;
            localStorage.setItem('user', JSON.stringify(res));
            this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`login error`, err);
        });
  }

  verifyOTP(data: any) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/OtpVerify`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`OtpVerify response`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}, Set new pin now.`);
            this.OtpVerify = res;
            localStorage.setItem('otp-res-value', JSON.stringify(res));
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
          this.global.log(`OtpVerify error`, err);
        });
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.signUpForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      pin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

  resendOTP() {
    this.global.log('Resend OTP');
    // this.navCtrl.setRoot('ChangePinPage', { fromLogin: true });
    if (!this.resending.value) {

      if (this.loginForm.controls['mobile'].value && this.loginForm.controls['mobile'].value.length == 10) {
        if (this.resending.time == 50) {
          if (this.resendText == 'Send OTP') {
            this.resendText = 'Re-send OTP';
          }
          this.requestOTP({ mobile: `${this.loginForm.controls['mobile'].value}` }, true);
        }
      } else {
        this.global.showToast(`Mobile number not correct`);
      }
    }
  }

  login() {
    this.global.log('Logging in', this.loginForm, this.signInData);

    if (this.signInData) {
      if (this.signUpForm.valid) {
        this.global.log('form is valid');
        // this.setPasscode({ user_id: this.OtpVerify.id, pin: this.signUpForm.controls['pin'].value });
        this.login_api(this.signUpForm.value);
      } else {
        this.isFormInvalid = true;
      }
    } else {
      if (this.loginForm.valid) {
        this.global.log('form is valid');
        let data = this.loginForm.value;
        data.mobile = `${data.mobile}`;
        this.verifyOTP(data);
      } else {
        this.isFormInvalid = true;
      }
    }
  }

  signIn() {
    this.global.log(`In signin`);
    if (!this.signInData) {
      this.navCtrl.setRoot('LoginPage', { signInData: true });
    } else {
      this.navCtrl.setRoot('LoginPage', { signInData: false });
    }
  }

  termsAndCondition() {
    this.global.log(`in termsAndCondition`);
  }

  privacyPolicy() {
    this.global.log(`in privacyPolicy`);
  }

}