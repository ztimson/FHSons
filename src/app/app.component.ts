import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {share} from 'rxjs/operators';

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
  newTotal: number = 0;

  constructor(private db: AngularFirestore) {
    this.formulas = this.db.collection('formulas').valueChanges();
  }

  displayFormula(formula) {
    formula.components.map(row => row.component = this.db.doc(`components/${row.component.id}`).valueChanges().pipe(share()));
    formula.total = formula.components.reduce((acc, row) => acc += row.quantity, 0);
    this.newTotal = formula.total;
    this.formula = formula;
  }
}
