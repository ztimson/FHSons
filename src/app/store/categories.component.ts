import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireStorage} from 'angularfire2/storage';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NewCategoryComponent} from './newCategory/newCategory.component';
import {AppComponent} from '../app.component';
import {DomSanitizer} from '@angular/platform-browser';
import {NewProductComponent} from './newProduct/newProduct.component';
import {DeleteComponent} from './delete/delete.component';

@Component({
  selector: 'store',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  category: string;
  categories;
  products;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    public app: AppComponent
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];

      this.categories = this.db
        .collection('categories', ref => ref.orderBy('name'))
        .snapshotChanges()
        .pipe(
          map(rows =>
            rows
              .map((row: any) =>
                Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data())
              )
              .filter((row: any) => (!this.category && !row.parent) || (this.category && row.parent == this.category))
              .map((row: any) => {
                row.image = this.domSanitizer.bypassSecurityTrustUrl(row.image);
                return row;
              })
          )
        );

      this.products = this.db
        .collection('products', ref => ref.orderBy('name'))
        .snapshotChanges()
        .pipe(
          map(rows =>
            rows
              .map((row: any) =>
                Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data())
              )
              .filter((row: any) => row.category == this.category)
              .map((row: any) => {
                row.image = this.domSanitizer.bypassSecurityTrustUrl(row.image);
                return row;
              })
          )
        );
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
}
