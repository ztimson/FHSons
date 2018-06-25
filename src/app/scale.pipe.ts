import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: 'scale'
  })
  export class ScalePipe implements PipeTransform {
    transform(quantity: number, total: number, newTotal: number): number {
        return quantity / total * newTotal;
      }
    }