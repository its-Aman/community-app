import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage {

  event: any;
  eventPerson: string[];
  userForm: FormGroup;
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
    this.event = this.navParams.get('data');
    this.event['description'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
    console.log('ionViewDidLoad EditEventPage', this.event);
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['Aman Kumar', [Validators.required]],
      mobile: ['123456789', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      noOfMEmbers: [16, [Validators.required]]
    });
  }

  eventPersonChange(ev: any) {
    this.global.log(`eventPersonChange's event is ${ev}`);
  }

  submit() {
    this.global.log(`submit's method`);
  }

  openCalendar() {
    this.global.log(`openCalendar's method`);
  }

  cancel() {
    this.global.log(`cancel's method`);
  }
}
