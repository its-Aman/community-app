import { Injectable } from '@angular/core';

@Injectable()
export class ThemeProvider {

  defaultTheme: any;

  constructor() {
    console.log('Hello ThemeProvider Provider');
  }

  loadDefaultTheme() {
    this.defaultTheme = {
      fontSize14: '14px',
      fontSize16: '16px',
      fontSize18: '18px',
      fontSize20: '20px',
      colorRed: 'red',
      colorGreen: '#48FF18',
    }
  }
}
