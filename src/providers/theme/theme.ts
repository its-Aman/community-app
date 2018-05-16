import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable()
export class ThemeProvider {

  defaultTheme: any;

  constructor(
    private sanitizer: DomSanitizer,
  ) {
    this.loadDefaultTheme();
    console.log('Hello ThemeProvider Provider');
  }

  loadDefaultTheme() {
    this.defaultTheme = {
      "setting_id": "7",
      "theme_name": "White Theme",
      "theme_colour": "#02A1E2",
      "spalsh_image": this.sanatizeImage("http://winstech.in/community/uploads/flash/1301382217.png"),
      "login_image": this.sanatizeImage("http://winstech.in/community/uploads/login/942347058.png"),
      "profile_image": this.sanatizeImage("http://winstech.in/community/uploads/login/942347058.png"),
      "heading_font_colour": "#777777",
      "data_font_colour": "#6f6f6f",
      "special_data_font_colour": "#02A1E2",
      "data_font_size": "12px",
      "heading_font_size": "12px",
      "special_data_font_size": "14px",
      "community_name": "dg",
      "logo_name": this.sanatizeImage("http://winstech.in/community/uploads/cummunitylogo/804204779.png"),
      "address": "gj",
      "city_id": "6094",
      "state_id": "114",
      "country_id": "3",
      "phone_no": "9638527412",
      "email": "ankita@expertwebtechnologies.com",
      "website": "yj",
      "geo_lat": "",
      "geo_long": "",
      "theme_id": "0",
      "contact_person": "fg",
      "about_us": "Lorem Ipsom is simple dummy text"
    }
  }

  sanatizeImage(image: string): any {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
