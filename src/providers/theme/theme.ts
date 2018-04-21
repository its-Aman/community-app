import { Injectable } from '@angular/core';

@Injectable()
export class ThemeProvider {

  defaultTheme: any;

  constructor() {
    console.log('Hello ThemeProvider Provider');
  }

  loadDefaultTheme() {
    this.defaultTheme = {

    }
  }
}
