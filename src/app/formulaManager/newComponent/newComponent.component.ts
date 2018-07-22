import {Component, ViewChild, Inject} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'new-component',
  templateUrl: 'newComponent.component.html'
})
export class NewComponentComponent {
  name: string;
  description: string;
  cost: number;

  constructor(
    private dialogRef: MatDialogRef<NewComponentComponent>,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    if (data) {
      this.name = data.name;
      this.description = data.description;
      this.cost = data.cost;
    }
  }

  submit() {
    let newComponent = {name: this.name, description: this.description, cost: Number(this.cost)};
    if (!this.data) newComponent['created'] = new Date();

    if (!this.data) {
      this.db
        .collection('components', ref => ref.orderBy('name'))
        .add(newComponent)
        .then(data => this.dialogRef.close());
    } else {
      this.data.ref.update(newComponent).then(data => this.dialogRef.close());
    }
  }
}
