import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NewCategoryComponent} from './newCategory/newCategory.component';
import {AppComponent} from '../app.component';
import {NewProductComponent} from './newProduct/newProduct.component';
import {DeleteComponent} from '../delete/delete.component';
import {AppStore} from '../app.store';
import {Category} from './category';
import {Observable} from 'rxjs';
import {Product} from './product';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'store',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  category: string;
  categories: Observable<Category[]>;
  products: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public app: AppComponent,
    public store: AppStore,
    private sanatize: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];

      this.categories = this.store.categories.pipe(map(rows => rows.filter(row => row.parent == this.category)));

      this.products = this.store.products.pipe(map(rows => rows.filter(row => row.category == this.category)));
    });
  }

  createCategory(category) {
    this.dialog.open(NewCategoryComponent, {data: {category: category, currentCategory: this.category}});
  }

  createProduct(product) {
    this.dialog.open(NewProductComponent, {data: {product: product, currentCategory: this.category}});
  }

  delete(obj) {
    this.dialog.open(DeleteComponent, {data: obj});
  }

  trust(url) { return this.sanatize.bypassSecurityTrustResourceUrl(url); }
}
