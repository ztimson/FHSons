import {Component} from '@angular/core';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'cart',
  templateUrl: 'cart.component.html'
})
export class CartComponent {
  address1: string;
  address2: string;
  city: string;
  province: string;
  postal: string;

  constructor(public app: AppComponent) {}

  ngOnInit() {
    if (this.app.cartCount()) {
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
}
