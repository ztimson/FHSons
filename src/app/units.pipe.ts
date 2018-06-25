import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertFromG'
  })
  export class ConvertFromGPipe implements PipeTransform {
    transform(grams: number, to: string): string {
      switch(to) {
          case 'oz':
              return `${Math.round(grams / 28.34952)} oz`;
          case 'lb':
              return `${Math.round((grams * 0.0022) * 100) / 100} lb`;
          case 'kg':
              return `${Math.round((grams / 1000) * 100) / 100} kg`;
          default:
              return `${Math.round(grams)} g`;
      }
    }
  }

  @Pipe({
    name: 'convertToG'
  })
  export class ConvertToGPipe implements PipeTransform {
    transform(units: number, from: string): string {
      switch(from) {
          case 'oz':
              return `${Math.round(units * 28.34952)} oz`;
          case 'lb':
              return `${Math.round(units / 0.0022)} lb`;
          case 'kg':
              return `${Math.round(units * 1000)} kg`;
          default:
              return `${Math.round(units)} g`;
      }
    }
  }