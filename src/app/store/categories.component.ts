import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireStorage} from 'angularfire2/storage';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '../../../node_modules/@angular/router';
import {BreadcrumbService} from './breadcrumb.service';

@Component({
  selector: 'store',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent {
  category: string;
  categories;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumb: BreadcrumbService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['category'];

      if (!this.category) this.breadcrumb.clear();

      this.categories = this.db
        .collection('categories')
        .valueChanges()
        .pipe(
          map(rows =>
            rows
              .filter((row: any) => (!this.category && !row.parent) || (this.category && row.parent == this.category))
              .map((row: any) => {
                row.image = this.storage.ref(`${row.name.toLowerCase()}.jpg`).getDownloadURL();
                row.image.subscribe(() => (row.ready = true));
                return row;
              })
          )
        );
    });
  }

  navigate(category: string) {
    this.breadcrumb.add(category);
    this.router.navigate(['/store', category]);
  }
}
