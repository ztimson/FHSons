import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireStorage} from 'angularfire2/storage';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '../../../node_modules/@angular/router';
import {MatDialog} from '../../../node_modules/@angular/material';
import {NewCategoryComponent} from './newCategory/newCategory.component';
import {AppComponent} from '../app.component';
import {DomSanitizer} from '../../../node_modules/@angular/platform-browser';
import {DeleteCategoryComponent} from './deleteCategory/deleteCategory.component';

@Component({
  selector: 'store',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  category: string;
  categories;

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
    });
  }

  create(category) {
    this.dialog.open(NewCategoryComponent, {data: {category: category, currentCategory: this.category}});
  }

  delete(category) {
    this.dialog.open(DeleteCategoryComponent, {data: category});
  }
}
