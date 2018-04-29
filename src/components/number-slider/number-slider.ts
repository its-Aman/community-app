import { GlobalProvider } from './../../providers/global/global';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'number-slider',
  templateUrl: 'number-slider.html'
})
export class NumberSliderComponent {



  @Input('seed') number: number = 0;
  @Input('max') max: number = 100;
  @Input('min') min: number = -100;

  @Output('getValue') getValue: EventEmitter<number> = new EventEmitter<number>();

  constructor(public global: GlobalProvider) {
    console.log('Hello NumberSliderComponent Component');
  }

  decrease() {
    this.global.log('in decrease()', this.number);
    if (this.number > this.min) {
      this.number--;
      this.emitValue();
    } else {
      this.number = 0;
    }
  }

  increase() {
    this.global.log('in increase()', this.number);
    if (this.number < this.max) {
      this.number++;
      this.emitValue();
    } else {
      this.number = 0;
    }
  }

  emitValue() {
    this.getValue.emit(this.number);
  }
}
