import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerformanceModalPage } from './performance-modal';
import { NumberSliderModule } from '../../components/number-slider/number-slider.module';

@NgModule({
  declarations: [
    PerformanceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PerformanceModalPage),
    NumberSliderModule    
  ],
})
export class PerformanceModalPageModule {}
