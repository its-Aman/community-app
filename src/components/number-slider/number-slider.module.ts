import { NgModule } from '@angular/core';
import { NumberSliderComponent } from './number-slider';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [NumberSliderComponent],
	imports: [CommonModule],
	exports: [NumberSliderComponent]
})
export class NumberSliderModule { }
