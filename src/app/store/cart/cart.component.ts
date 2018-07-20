import {Component} from '@angular/core';
import {LocalStorage} from 'webstorage-decorators';
import {access} from 'fs';

@Component({
  selector: 'cart',
  templateUrl: 'cart.component.html'
})
export class CartComponent {
  @LocalStorage({defaultValue: []})
  cart: {id: string; item: string; price: number; quantity: number}[];

  address1: string;
  address2: string;
  city: string;
  province: string;
  postal: string;

  constructor() {}

  remove(i: number) {
    let c = this.cart;
    c.splice(i, 1);
    this.cart = c;
  }

  total() {
    return this.cart.reduce((acc, row) => acc + row.price * row.quantity, 0);
  }
}
