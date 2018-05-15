import { GlobalProvider } from './../providers/global/global';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ThemeProvider } from '../providers/theme/theme';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public global: GlobalProvider,
    public theme: ThemeProvider
  ) {
    this.setRootPage();
    // this.getTheme();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      statusBar.overlaysWebView(false);
    });
  }

  setRootPage() {
    if (localStorage.getItem('user')) {
      this.rootPage = 'MenuPage';
    } else {
      this.rootPage = 'LoginPage';
    }
  }

  getTheme() {
    this.global.postRequest(`${this.global.base_path}Login/Theme`, {})
      .subscribe(
        res => {
          this.global.log(`in theme api and the response is`, res);
          if (res.success == 'true') {
            this.theme.defaultTheme = res.theme;
            this.fixImages();
            this.addDtyleToIndexHTML();
          } else {
            this.global.log(`res if false in theme api data`, res);
          }
        }, err => {
          this.global.log(`some error in theme api data`, err);
        });
  }

  fixImages() {
    if (this.theme.defaultTheme.logo_name) {
      this.theme.defaultTheme.logo_name = this.theme.sanatizeImage(`http://winstech.in/community/uploads/cummunitylogo/${this.theme.defaultTheme.logo_name}`);
    }

    if (this.theme.defaultTheme.login_image) {
      this.theme.defaultTheme.login_image = this.theme.sanatizeImage(`http://winstech.in/community/uploads/login/${this.theme.defaultTheme.login_image}`);
    }

    if (this.theme.defaultTheme.spalsh_image) {
      this.theme.defaultTheme.spalsh_image = this.theme.sanatizeImage(`http://winstech.in/community/uploads/flash/${this.theme.defaultTheme.spalsh_image}`);
    }

  }

  addDtyleToIndexHTML() {
    this.global.log(`in addDtyleToIndexHTML`);
    let css = `
    .toolbar-background-md{
      border-color: ${this.theme.defaultTheme.theme_colour} !important;
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .toolbar-md-toolbarBackgroundColor .toolbar-background-md{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
      border-color: ${this.theme.defaultTheme.theme_colour} !important;
  }
    `;

    let head: any = document.head || document.getElementsByTagName('head')[0], style: any = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }
}

