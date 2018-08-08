import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Category} from './store/category';
import {Observable, combineLatest} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {DomSanitizer} from '@angular/platform-browser';
import {Product} from './store/product';
import {AngularFireAuth} from '../../node_modules/angularfire2/auth';
import {Component} from './formulaManager/component';
import {Formula} from './formulaManager/formula';

@Injectable()
export class AppStore {
  categories: Observable<Category[]>;
  components: Observable<Component[]>;
  formulas: Observable<Formula[]>;
  products: Observable<Product[]>;
  user: any;

  constructor(private domSanitizer: DomSanitizer, private db: AngularFirestore, private auth: AngularFireAuth) {
    this.categories = this.db
      .collection('categories', row => row.orderBy('name'))
      .snapshotChanges()
      .pipe(
        map(rows =>
          rows.map((row: any) => {
            let temp = Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data());
            temp.image = this.domSanitizer.bypassSecurityTrustUrl(temp.image);
            return <Category>temp;
          })
        ),
        shareReplay(1)
      );

    this.components = this.db
      .collection('components', row => row.orderBy('name'))
      .snapshotChanges()
      .pipe(
        map(rows =>
          rows.map((row: any) => {
            let temp = Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data());
            temp.created = temp.created.toDate();
            return <Component>temp;
          })
        ),
        shareReplay(1)
      );

    this.formulas = combineLatest(
      this.db.collection('formulas', row => row.orderBy('name')).snapshotChanges(),
      this.components
    ).pipe(
      map(data =>
        data[0].map(row => {
          let temp = <any>Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data());
          temp.created = temp.created.toDate();

          temp.components = temp.components.map(row => {
            let component = data[1].filter(c => c.id == row.component.id)[0];
            return {component: component, quantity: row.quantity};
          });

          return <Formula>temp;
        })
      ),
      shareReplay(1)
    );

    this.products = this.db
      .collection('products', row => row.orderBy('name'))
      .snapshotChanges()
      .pipe(
        map(rows =>
          rows.map((row: any) => {
            let temp = Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data());
            temp.originalImage = temp.image;
            temp.image = this.domSanitizer.bypassSecurityTrustUrl(temp.image);
            temp.originalDescription = temp.description;
            temp.description = this.domSanitizer.bypassSecurityTrustHtml(
              temp.description.replace(/(\r\n|\r|\n)/g, '<br>')
            );
            return <Product>temp;
          })
        ),
        shareReplay(1)
      );

    this.auth.user.subscribe(row => (this.user = row));
  }
}
