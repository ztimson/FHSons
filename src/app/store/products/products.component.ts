import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from 'node_modules/@angular/platform-browser';
import {AppComponent} from '../../app.component';
import {map} from 'rxjs/operators';

@Component({
  selector: 'products',
  templateUrl: 'products.component.html'
})
export class ProductsComponent {
  product;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private domSanitizer: DomSanitizer,
    public app: AppComponent
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.db
        .collection('products', ref => ref.where('name', '==', params['product']))
        .snapshotChanges()
        .pipe(
          map(rows =>
            rows.map((row: any) => Object.assign({id: row.payload.doc.id}, row.payload.doc.data())).map((row: any) => {
              row.image = this.domSanitizer.bypassSecurityTrustUrl(row.image);
              row.description = this.domSanitizer.bypassSecurityTrustHtml(
                row.description.replace(/(\r\n|\r|\n)/g, '<br>')
              );
              return row;
            })
          )
        )
        .subscribe(data => {
          this.product = data[0];
        });
    });
  }
}
