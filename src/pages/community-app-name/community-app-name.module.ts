import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityAppNamePage } from './community-app-name';

@NgModule({
  declarations: [
    CommunityAppNamePage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityAppNamePage),
  ],
})
export class CommunityAppNamePageModule {}
