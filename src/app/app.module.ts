
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { MyApp } from './app.component';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { HttpClientModule } from '@angular/common/http';
import { ThemeProvider } from '../providers/theme/theme';
import { GlobalProvider } from './../providers/global/global';
import { Camera } from '@ionic-native/camera';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ReactiveFormsModule } from '@angular/forms';
import { FCM } from '@ionic-native/fcm';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(MyApp, {
      iconMode: 'md',
      mode: 'md'
    }),
    SuperTabsModule.forRoot(),
    ReactiveFormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalProvider,
    ThemeProvider,
    Geolocation,
    StatusBar,
    Keyboard,
    InAppBrowser,
    Camera,
    QRScanner,
    Diagnostic,
    UniqueDeviceID,
    FCM
  ]
})
export class AppModule { }
