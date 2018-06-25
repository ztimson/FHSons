import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'convertFromG'
})
export class ConvertFromGPipe implements PipeTransform {
  transform(grams: number, to: string): number {
    switch (to) {
      case 'oz':
        return Math.round(grams / 28.34952);
      case 'lb':
        return Math.round(grams * 0.0022 * 100) / 100;
      case 'kg':
        return Math.round((grams / 1000) * 100) / 100;
      default:
        return Math.round(grams);
    }
  }
}

@Pipe({
  name: 'convertToG'
})
export class ConvertToGPipe implements PipeTransform {
  transform(units: number, from: string): number {
    switch (from) {
      case 'oz':
        return Math.round(units * 28.34952);
      case 'lb':
        return Math.round(units / 0.0022);
      case 'kg':
        return Math.round(units * 1000);
      default:
        return Math.round(units);
    }
  }
}
