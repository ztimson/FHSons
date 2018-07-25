import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AngularFirestore} from 'angularfire2/firestore';
import {LocalStorage} from '../../../../node_modules/webstorage-decorators';
import {AppStore} from '../../app.store';
import {ConvertToGPipe} from '../units.pipe';

@Component({
  selector: 'new-formula',
  templateUrl: './newFormula.component.html'
})
export class NewFormulaComponent {
  name: string;
  amount: number;
  approved: boolean = false;
  component: string;
  components: {component: string; name: string; quantity: number}[] = [];
  componentsList = [];
  @LocalStorage({defaultValue: 'kg', fieldName: 'newFormulaUnit'})
  unit;

  constructor(
    private dialogRef: MatDialogRef<NewFormulaComponent>,
    private db: AngularFirestore,
    private store: AppStore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.store.components.subscribe(rows => (this.componentsList = rows));

    if (this.data) {
      this.name = this.data.name;
      this.approved = this.data.approved;
      this.components = this.data.components.map(row => {
        return {component: row.component.id, name: row.component.name, quantity: row.quantity};
      });
    }
  }

  add() {
    let id = this.componentsList.filter(row => row.name == this.component)[0].id;
    console.log(id);
    let amount = new ConvertToGPipe().transform(Number(this.amount), this.unit);
    this.components.push({component: id, name: this.component, quantity: amount});
    this.component = null;
    this.amount = null;
  }

  remove(i) {
    this.components.splice(i, 1);
  }

  submit() {
    let newFormula = {
      name: this.name,
      approved: this.approved,
      components: this.components.map((row: any) => {
        return {component: this.db.collection('components').doc(row.component).ref, quantity: row.quantity};
      })
    };

    if (!this.data) {
      newFormula['created'] = new Date();
      this.db
        .collection('formulas')
        .add(newFormula)
        .then(data => this.dialogRef.close());
    } else {
      this.data.ref.update(newFormula).then(data => this.dialogRef.close());
    }
  }

  total() {
    return this.components.reduce((acc, row) => acc + row.quantity, 0);
  }
}
