import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireStorage} from 'angularfire2/storage';
import {map} from 'rxjs/operators';

@Component({
  selector: 'store',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  categories;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {
    this.categories = this.db
      .collection('categories')
      .valueChanges()
      .pipe(
        map(rows =>
          rows.map((row: any) => {
            row.image = this.storage.ref(`${row.name.toLowerCase()}.jpg`).getDownloadURL();
            row.image.subscribe(() => (row.ready = true));
            return row;
          })
        )
      );
  }
}
