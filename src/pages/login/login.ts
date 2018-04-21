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

  loginForm: FormGroup;
  isFormInvalid: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider
  ) {
    this.initForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.loginForm.controls['mobile'].valueChanges.subscribe(res=>{
      if (res && res.length > 10) {
        this.loginForm.controls['mobile'].setValue(this.loginForm.controls['mobile'].value.slice(0, 10));
      }
    });
  }

  initForm() {
    this.loginForm = this.fb.group({
      mobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      otp: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  resendOTP() {
    this.global.log('forgot password');
  }

  login() {
    this.global.log('Logging in', this.loginForm);

    if (this.loginForm.valid) {
      this.global.log('form is valid');
      this.navCtrl.setRoot('MenuPage', {data: null});
    } else {
      this.isFormInvalid = true;
    }
  }
}
