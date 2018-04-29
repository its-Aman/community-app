import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventRegistrationPage } from './event-registration';
import { NumberSliderModule } from '../../components/number-slider/number-slider.module';

@NgModule({
  declarations: [
    EventRegistrationPage,
  ],
  imports: [
    IonicPageModule.forChild(EventRegistrationPage),
    NumberSliderModule
  ],
})
export class EventRegistrationPageModule {}
