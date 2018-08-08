import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppComponent} from '../../app.component';
import {map} from 'rxjs/operators';
import {AppStore} from '../../app.store';
import {Product} from '../product';
import {SafeUrl, DomSanitizer} from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'products',
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  product: Product;
  preview: SafeUrl[];
  links: {name: string; link: string; type: string}[];
  attachments: {name: string; link: string; type: string}[];

  constructor(
    private store: AppStore,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    public app: AppComponent
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.store.products.pipe(map(rows => rows.filter(row => row.name == params['product']))).subscribe(data => {
        this.product = data[0];

        this.preview = [this.product.originalImage];
        if (this.product.files) {
          this.preview = this.preview.concat(
            this.product.files.filter(row => row.type == 'preview').map(row => row.link)
          );
          this.links = this.product.files.filter(row => row.type == 'link');
          this.attachments = this.product.files.filter(row => row.type == 'other');
        }
      });
    });
  }
}
