import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityAppPage } from './community-app';

@NgModule({
  declarations: [
    CommunityAppPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityAppPage),
  ],
})
export class CommunityAppPageModule {}
