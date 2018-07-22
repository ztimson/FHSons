import {Component} from '@angular/core';
import {LocalStorage} from 'webstorage-decorators';
import {access} from 'fs';
import {Http} from '../../../../node_modules/@angular/http';
import {Router} from '../../../../node_modules/@angular/router';

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

  constructor(private http: Http, private router: Router) {}

  async checkout() {
    let cart = this.cart.map(row => {
      return {id: row.id, quantity: row.quantity};
    });
    let link = await this.http
      .post('https://us-central1-fhsons-7e90b.cloudfunctions.net/checkout', {cart: cart})
      .toPromise();
    window.location.href = link.url;
  }

  remove(i: number) {
    let c = this.cart;
    c.splice(i, 1);
    this.cart = c;
  }

  total() {
    return this.cart.reduce((acc, row) => acc + row.price * row.quantity, 0);
  }
}
