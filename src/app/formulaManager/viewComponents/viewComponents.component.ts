import {Component} from '@angular/core';
import {AngularFirestore} from '../../../../node_modules/angularfire2/firestore';
import {map} from 'rxjs/operators';
import {MatDialog} from '../../../../node_modules/@angular/material';
import {DeleteComponent} from '../../delete/delete.component';

@Component({
  selector: '',
  templateUrl: './viewComponents.component.html'
})
export class ViewComponents {
  components;

  constructor(private db: AngularFirestore, private dialog: MatDialog) {
    this.components = this.db
      .collection('components')
      .snapshotChanges()
      .pipe(
        map(rows =>
          rows.map((row: any) => {
            row = Object.assign({id: row.payload.doc.id, ref: row.payload.doc.ref}, row.payload.doc.data());
            row.created = row.created.toDate();
            return row;
          })
        )
      );
  }

  delete(component) {
    this.dialog.open(DeleteComponent, {data: component});
  }
}
