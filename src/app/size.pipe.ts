import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'size'
})
export class SizePipe implements PipeTransform {

    constructor() { }

    transform(val, unit) {
        return `${Math.round(val)} KB`;
    }
}