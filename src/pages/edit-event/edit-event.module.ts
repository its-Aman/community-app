import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEventPage } from './edit-event';
import { NumberSliderModule } from '../../components/number-slider/number-slider.module';

@NgModule({
  declarations: [
    EditEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEventPage),
    NumberSliderModule
  ],
})
export class EditEventPageModule {}
