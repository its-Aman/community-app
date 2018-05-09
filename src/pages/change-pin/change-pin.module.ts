import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePinPage } from './change-pin';

@NgModule({
  declarations: [
    ChangePinPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePinPage),
  ],
})
export class ChangePinPageModule {}
