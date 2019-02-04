import {Component, Inject} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {DeleteComponent} from '../../delete/delete.component';

@Component({
  selector: 'new-component',
  templateUrl: 'newComponent.component.html'
})
export class NewComponentComponent {
  name: string;
  description: string;
  price: number;

  constructor(
    private dialogRef: MatDialogRef<NewComponentComponent>,
    private dialog: MatDialog,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    if (data) {
      this.name = data.name;
      this.description = data.description;
      this.price = data.price;
    }
  }

  delete() {
    this.dialog.open(DeleteComponent, {data: this.data}).afterClosed().subscribe(() => this.dialogRef.close());
  }

  submit() {
    let newComponent = {name: this.name, description: this.description, price: Number(this.price), createdOn: new Date()};

    if (!this.data) {
      newComponent['created'] = new Date();
      this.db
        .collection('components')
        .doc(newComponent.name).set(newComponent)
        .then(ignore => this.dialogRef.close());
    } else {
      this.data.ref.update(newComponent).then(ignore => this.dialogRef.close());
    }
  }
}
