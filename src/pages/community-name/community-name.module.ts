import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityNamePage } from './community-name';

@NgModule({
  declarations: [
    CommunityNamePage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityNamePage),
  ],
})
export class CommunityNamePageModule {}
