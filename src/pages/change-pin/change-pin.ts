import { GlobalProvider } from './../../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-change-pin',
  templateUrl: 'change-pin.html',
})
export class ChangePinPage {

  changePinForm: FormGroup;
  isFormInvalid: boolean = false;
  otpResponseValue: any;
  fromLogin: boolean;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public global: GlobalProvider,
    public keyboard: Keyboard,
  ) {
    this.fromLogin = this.navParams.get('fromLogin');

    if (this.fromLogin) {
      this.otpResponseValue = JSON.parse(localStorage.getItem('otp-res-value'));
    } else {
      this.otpResponseValue = JSON.parse(localStorage.getItem('user'));
    }

    this.global.cLog(`this from login value is`, this.fromLogin, this.otpResponseValue);
    this.initForm();
  }

  initForm() {
    if (this.fromLogin) {
      this.changePinForm = this.fb.group({
        oldPin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        newPin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
      });
    } else {
      this.changePinForm = this.fb.group({
        oldPin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        newPin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        conformPin: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
      });

    }
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ChangePinPage', this.fromLogin);

    this.changePinForm.controls['oldPin'].valueChanges.subscribe(res => {
      if (res && res.length > 6) {
        this.changePinForm.controls['oldPin'].setValue(this.changePinForm.controls['oldPin'].value.slice(0, 6));
      }
    });

    this.changePinForm.controls['newPin'].valueChanges.subscribe(res => {
      if (res && res.length > 6) {
        this.changePinForm.controls['newPin'].setValue(this.changePinForm.controls['newPin'].value.slice(0, 6));
      }
    });

    if (!this.fromLogin) {

      this.changePinForm.controls['conformPin'].valueChanges.subscribe(res => {
        if (res && res.length > 6) {
          this.changePinForm.controls['conformPin'].setValue(this.changePinForm.controls['conformPin'].value.slice(0, 6));
        }
      });

    }

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

  changePassword() {
    this.global.cLog(`in changePassword and the form is`, this.changePinForm);
    if (this.changePinForm.valid) {
      if (this.fromLogin) {
        if (this.changePinForm.controls['oldPin'].value == this.changePinForm.controls['newPin'].value) {
          this.setPasscode(
            {
              user_id: localStorage.getItem('user_id'),
              pin: this.changePinForm.controls['newPin'].value
            }
          );
        } else {
          this.global.showToast(`PIN does not match`);
        }
      } else {
        if (this.changePinForm.controls['conformPin'].value == this.changePinForm.controls['newPin'].value) {
          this.global.cLog('form is valid');
          // this.navCtrl.setRoot('LoginPage', { signInData: true });
          this.setPasscode({ user_id: this.otpResponseValue.id, pin: this.changePinForm.controls['newPin'].value })
        } else {
          this.global.showToast(`PIN does not match`);
        }
      }
    } else {
      this.isFormInvalid = true;
    }
  }

  setPasscode(data: any) {
    this.global.showLoader();
    this.global.postRequest(`${this.global.base_path}Login/SetPasscode`, data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.cLog(`SetPasscode res`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}, Please Login now`);
            this.navCtrl.setRoot('LoginPage', { signInData: true });
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`SetPasscode err`, err);
        });
  }

  removePadding() {
    this.global.cLog(`in removePadding`);
    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');
    this.global.cLog(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

}
