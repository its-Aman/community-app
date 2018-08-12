import { GlobalProvider } from './../../providers/global/global';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'number-slider',
  templateUrl: 'number-slider.html'
})
export class NumberSliderComponent {



  @Input('seed') number: number = 0;
  @Input('max') max: number = 100;
  @Input('min') min: number = 1;
  @Input('mock') mock: boolean = false;

  @Output('increased') increased: EventEmitter<number> = new EventEmitter<number>();
  @Output('decreased') decreased: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public global: GlobalProvider,
    public theme: ThemeProvider
  ) {
    console.log('Hello NumberSliderComponent Component');
  }

  decrease() {
    this.global.cLog('in decrease()', this.number, this.mock);

    if (!this.mock) {
      if (this.number > this.min) {
        this.number--;
        this.emitValueDecreased();
      } else {
        this.number = this.min;
      }
    }
  }

  increase() {
    this.global.cLog('in increase()', this.number, this.mock);

    if (!this.mock) {
      if (this.number < this.max) {
        this.number++;
        this.emitValueIncreased();
      } else {
        this.number = this.max;
      }
    }
  }

  emitValueIncreased() {
    this.increased.emit(this.number);
  }

  emitValueDecreased() {
    this.decreased.emit(this.number);
  }

}
