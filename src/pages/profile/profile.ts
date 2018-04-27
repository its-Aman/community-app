import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  modeOfCommunication: string[];
  profileForm: FormGroup;
  isDisabled: boolean = true;
  isFormInvalid: boolean = false;
  @ViewChild('ip') ip: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public fb: FormBuilder,
  ) {
    this.initForm();
  }

  initForm() {
    this.profileForm = this.fb.group({
      email: ['google@gmail.com', [Validators.required, Validators.email]],
      address: ['Jaipur-302006, Rajasthan, India C:+91-141-2229900', [Validators.required]],
      modeOfCommunication: ['E', [Validators.required]],
      professionalService: ['P', [Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    // this.isDisabled = !this.profileForm.valid;
    this.change();
  }

  edit() {
    this.global.log('edit clicked');
    this.isDisabled = !this.isDisabled;
  }

  submit() {
    this.global.log('submit clicked', this.profileForm);
    let foo = this.navParams.get('data');

    if (foo && foo.fromLogin) {
      if (this.profileForm.valid) {
        this.isFormInvalid = false;
        this.global.log('form is valid');
        this.navCtrl.setRoot('MenuPage', { data: null });
      } else {
        this.global.log('form is invalid');
        this.isFormInvalid = true;
      }
    }
  }

  change() {
    this.global.log('this.ip is ', this.ip);
    let element = this.ip._elementRef.nativeElement;

    let textarea: HTMLElement = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight = '0';
    textarea.style.height = '0';

    // limit size to 96 pixels (6 lines of text)
    let scroll_height = textarea.scrollHeight;
    if (scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height = scroll_height + "px";
    textarea.style.minHeight = scroll_height + "px";
    textarea.style.height = scroll_height + "px";
  }

}