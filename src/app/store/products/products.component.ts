import {Component} from '@angular/core';
import {AngularFirestore} from '../../../../node_modules/angularfire2/firestore';
import {ActivatedRoute} from '../../../../node_modules/@angular/router';
import {DomSanitizer} from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'products',
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  product;

  constructor(private route: ActivatedRoute, private db: AngularFirestore, private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.db
        .collection('products', ref => ref.where('name', '==', params['product']))
        .valueChanges()
        .subscribe(data => {
          this.product = data[0];
          this.product.image = this.domSanitizer.bypassSecurityTrustUrl(this.product.image);
        });
    });
  }
}
