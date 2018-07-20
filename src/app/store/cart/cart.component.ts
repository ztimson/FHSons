import {Component} from '@angular/core';
import {LocalStorage} from 'webstorage-decorators';

@Component({
    selector: 'cart',
    templateUrl: 'cart.component.html'
})
export class CartComponent {
    @LocalStorage({defaultValue: []}) cart: {id: string, name: string, cost: number, quantity: number}[]; 

    constructor() {

    }
}