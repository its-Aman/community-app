import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventRegistrationPage } from './event-registration';

@NgModule({
  declarations: [
    EventRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(EventRegistrationPage),
  ],
})
export class EventRegistrationPageModule {}
