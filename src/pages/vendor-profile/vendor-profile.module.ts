import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorProfilePage } from './vendor-profile';

@NgModule({
  declarations: [
    VendorProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(VendorProfilePage),
  ],
})
export class VendorProfilePageModule {}
