import { GlobalProvider } from './../providers/global/global';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ThemeProvider } from '../providers/theme/theme';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  @ViewChild('myNav') nav: NavController;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public global: GlobalProvider,
    public theme: ThemeProvider,
    public events: Events,
  ) {
    this.setRootPage();
    this.getTheme();
    // this.addDtyleToIndexHTML();

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
      this.global.log(`in setting page`);
      setTimeout(() => {
        this.events.publish('set-login', true);
      }, 500);
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
            this.global.log(`theme is `, this.theme.defaultTheme);
          } else {
            this.global.log(`res if false in theme api data`, res);
          }
        }, err => {
          this.global.log(`some error in theme api data`, err);
        });
  }

  fixImages() {
    if (this.theme.defaultTheme.logo_name) {
      // this.theme.defaultTheme.logo_name = this.theme.sanatizeImage(`http://winstech.in/community/uploads/cummunitylogo/${this.theme.defaultTheme.logo_name}`);
      this.theme.defaultTheme.logo_name = `http://winstech.in/community/uploads/cummunitylogo/${this.theme.defaultTheme.logo_name}`;
    }

    if (this.theme.defaultTheme.login_image) {
      // this.theme.defaultTheme.login_image = this.theme.sanatizeImage(`http://winstech.in/community/uploads/login/${this.theme.defaultTheme.login_image}`);
      this.theme.defaultTheme.login_image = `http://winstech.in/community/uploads/login/${this.theme.defaultTheme.login_image}`;
    }

    if (this.theme.defaultTheme.spalsh_image) {
      // this.theme.defaultTheme.spalsh_image = this.theme.sanatizeImage(`http://winstech.in/community/uploads/flash/${this.theme.defaultTheme.spalsh_image}`);
      this.theme.defaultTheme.spalsh_image = `http://winstech.in/community/uploads/flash/${this.theme.defaultTheme.spalsh_image}`;
    }

    if (this.theme.defaultTheme.profile_image) {
      // this.theme.defaultTheme.profile_image = this.theme.sanatizeImage(`http://winstech.in/community/uploads/flash/${this.theme.defaultTheme.profile_image}`);
      this.theme.defaultTheme.profile_image = `http://winstech.in/community/uploads/profile/${this.theme.defaultTheme.profile_image}`;
    }

    this.theme.defaultTheme.data_font_colour = '#' + this.theme.defaultTheme.data_font_colour;
    this.theme.defaultTheme.heading_font_colour = '#' + this.theme.defaultTheme.heading_font_colour;
    this.theme.defaultTheme.special_data_font_colour = '#' + this.theme.defaultTheme.special_data_font_colour;
    this.theme.defaultTheme.theme_colour = '#' + this.theme.defaultTheme.theme_colour;

  }

  addDtyleToIndexHTML() {
    this.global.log(`in addDtyleToIndexHTML`);
    let css = `

    //for fonts
    // @font-face {
    //   font-family: '${this.theme.defaultTheme.data_font_name}';
    //   src: url("${this.theme.defaultTheme.data_font_name}") !important;
    //   }
    //   ion-app.md {
    //       font-family: 'Nunito','sans-serif' !important;
    //   }
    //   .ui-widget{
    //       font-family: 'Nunito','sans-serif' !important;
    //   }

    .toolbar-background-md{
      border-color: ${this.theme.defaultTheme.theme_colour} !important;
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .toolbar-md-toolbarBackgroundColor .toolbar-background-md{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
      border-color: ${this.theme.defaultTheme.theme_colour} !important;
    }
    .button-md-primary{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-menu .menu-header-grid{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-community-name .row-filter{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-event-registration .submit .button-md{
      background-color: ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-edit-event .submit .button-md{
      background-color: ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-event-registration .details .row-header{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-edit-event .details .row-header{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-community-app .grid-profession .row-profession .active{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-community-app .grid-profession .details .row-header{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-promotion-discount .grid-promo .row-promo .active{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-change-pin .button-md{
      background-color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-login .button-md{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-profile .submitButton{
      background:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .checkbox-md .checkbox-checked{
      border-color:  ${this.theme.defaultTheme.theme_colour} !important;
      background-color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .alert-md .alert-button{
      color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .alert-md [aria-checked=true] .alert-radio-icon{
      border-color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .select-text{
      color:  ${this.theme.defaultTheme.data_font_colour} !important;
    }
    .alert-md [aria-checked=true] .alert-checkbox-icon{
      background-color:  ${this.theme.defaultTheme.theme_colour} !important;
      border-color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .alert-md [aria-checked=true] .alert-radio-label{
      color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    .alert-md .alert-radio-inner{
      background-color:  ${this.theme.defaultTheme.theme_colour} !important;
    }
    page-menu .menu-header-col p{
      color: white;
    }   
    page-change-pin .scroll-content{
      background-image: url('${this.theme.defaultTheme.login_image}') !important;
    } 
    page-login .scroll-content {
     background-image: url('${this.theme.defaultTheme.login_image}') !important;
    }
    page-profile .images .backgroundImage{
      background-image: url('${this.theme.defaultTheme.profile_image}') !important;
    }
    page-contact-us .images .backgroundImage{
      background-image: url('${this.theme.defaultTheme.spalsh_image}') !important;
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

