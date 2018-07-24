import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../app.component';
import {map} from 'rxjs/operators';
import {AppStore} from '../../app.store';

@Component({
  selector: 'products',
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  product;

  constructor(private store: AppStore, private route: ActivatedRoute, public app: AppComponent) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.products.pipe(map(rows => rows.filter(row => row.name == params['product']))).subscribe(data => {
        this.product = data[0];
      });
    });
  }
}
