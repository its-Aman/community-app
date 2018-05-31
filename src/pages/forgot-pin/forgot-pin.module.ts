import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPinPage } from './forgot-pin';

@NgModule({
  declarations: [
    ForgotPinPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotPinPage),
  ],
})
export class ForgotPinPageModule {}
