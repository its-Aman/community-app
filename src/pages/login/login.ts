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

  resending: any = { time: 50, value: false };
  signInData: any;
  loginForm: FormGroup;
  signUpForm: FormGroup;
  isFormInvalid: boolean = false;
  signInOtp: string;

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
      if (res && res.length > 11) {
        this.loginForm.controls['mobile'].setValue(this.loginForm.controls['mobile'].value.slice(0, 11));
      }
    });

    this.loginForm.controls['otp'].valueChanges.subscribe(res => {
      if (res && res.length > 4) {
        this.loginForm.controls['otp'].setValue(this.loginForm.controls['otp'].value.slice(0, 4));
      }
    });

    this.signUpForm.controls['mobile'].valueChanges.subscribe(res => {
      if (res && res.length > 11) {
        this.signUpForm.controls['mobile'].setValue(this.signUpForm.controls['mobile'].value.slice(0, 11));
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
  }

  removePadding() {
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      otp: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });

    this.signUpForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      pin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
  }

  resendOTP() {
    this.global.log('Resend OTP');
    if (!this.resending.value) {

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
  }

  login() {
    this.global.log('Logging in', this.loginForm);

    if (this.signInData) {
      if (this.signUpForm.valid) {
        this.global.log('form is valid');
        this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
      } else {
        this.isFormInvalid = true;
      }
    } else {
      if (this.loginForm.valid) {
        this.global.log('form is valid');
        this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
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
}