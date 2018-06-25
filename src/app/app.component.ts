import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {share} from 'rxjs/operators';
import {ConvertFromGPipe, ConvertToGPipe} from './units.pipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formulas;
  formula;
  components;
  unit = 'g';

  _newTotal: number = 0;
  get newTotal() {
    return new ConvertFromGPipe().transform(this._newTotal, this.unit);
  }
  set newTotal(total) {
    this._newTotal = new ConvertToGPipe().transform(total, this.unit);
  }

  constructor(private db: AngularFirestore) {
    this.formulas = this.db.collection('formulas').valueChanges();
  }

  displayFormula(formula) {
    formula.components.map(
      row =>
        (row.component = this.db
          .doc(`components/${row.component.id}`)
          .valueChanges()
          .pipe(share()))
    );
    formula.total = formula.components.reduce((acc, row) => (acc += row.quantity), 0);
    this.newTotal = formula.total;
    this.formula = formula;
  }
}
