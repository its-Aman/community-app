import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  resending: any = { time: 50, value: false };
  signInData: any;
  loginForm: FormGroup;
  isFormInvalid: boolean = false;
  signInOtp: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider
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
      if (res && res.length > 6) {
        this.loginForm.controls['otp'].setValue(this.loginForm.controls['otp'].value.slice(0, 6));
      }
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
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
      this.global.log(`in Signin, with otp value`, this.signInOtp);
      if (this.signInOtp) {
        this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
      }
    } else {
      if (this.loginForm.valid) {
        this.global.log('form is valid');
        // this.navCtrl.setRoot('MenuPage', { data: null });
        this.navCtrl.setRoot('ProfilePage', { data: { fromLogin: true } });
      } else {
        this.isFormInvalid = true;
      }
    }
  }

  signIn() {
    this.global.log(`In signin`);
    if (!this.signInData) {
      this.navCtrl.push('LoginPage', { signInData: true })
    }
  }

  otpValidator() {
    if (this.signInOtp && this.signInOtp.length > 6) {
      this.signInOtp = this.signInOtp.slice(0, 6);
    }
  }
}
