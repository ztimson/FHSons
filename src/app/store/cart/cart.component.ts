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
  cart: {id: string; item: string; price: number; curency: 'CAD' | 'USD'; quantity: number}[];

  address1: string;
  address2: string;
  city: string;
  province: string;
  postal: string;

  constructor(private http: Http, private router: Router) {}

  ngOnInit() {
    if (this.cart.length > 0) {
      window['paypal'].Button.render(
        {
          env: 'sandbox',
          client: {
            sandbox: 'AejQ8-4hWWWhg1gYKbcuimT8Nf6-wutpEfYBHDDXiEXdujwJzHt6szwtmXBe2d3zW9d3khb3TgQBZUUJ',
            live: 'AUhKVWkqvpzRBg0n_IFPMNi9QAl4JCXuWzc04BERDpBdG5ixFH1SimU85I9YSaksqKNCFjp_fOd4OAdd'
          },
          style: {size: 'medium', color: 'blue', shape: 'pill'},
          payment: function(data, actions) {
            return actions.payment.create({transactions: [{amount: {total: 0.01, currency: 'CAD'}}]});
          },
          onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function() {
              window.alert('Thank you for your purchase!');
            });
          }
        },
        '#paypal-button'
      );
    }
  }

  remove(i: number) {
    console.log('fire');
    let c = this.cart;
    c.splice(i, 1);
    this.cart = c;
  }

  total() {
    return this.cart.reduce((acc, row) => acc + row.price * row.quantity, 0);
  }
}
