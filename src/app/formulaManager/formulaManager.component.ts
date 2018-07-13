import {Component, ElementRef, ViewChildren, HostListener} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ConvertFromGPipe, ConvertToGPipe} from './units.pipe';
import {ElectronService} from 'ngx-electron';
import {LocalStorage} from 'webstorage-decorators';

@Component({
  selector: 'formula-manager',
  templateUrl: './formulaManager.component.html'
})
export class FormulaManagerComponent {
  @ViewChildren('cost') componentCosts: ElementRef[];

  formulas;
  formula;
  installPrompt;
  components;
  @LocalStorage({defaultValue: 'g'})
  unit;

  _newTotal: number = 0;
  get newTotal() {
    return new ConvertFromGPipe().transform(this._newTotal, this.unit);
  }
  set newTotal(total) {
    this._newTotal = new ConvertToGPipe().transform(total, this.unit);
  }

  constructor(private db: AngularFirestore, public electron: ElectronService) {
    this.formulas = this.db.collection('formulas').valueChanges();
  }

  displayFormula(formula) {
    formula.components
      .filter(row => typeof row.component.get == 'function')
      .forEach((row, i, arr) => row.component.get().then(row => (arr[i].component = row.data())));
    formula.total = formula.components.reduce((acc, row) => (acc += row.quantity), 0);
    this.newTotal = new ConvertFromGPipe().transform(formula.total, this.unit);
    this.formula = formula;
  }

  create(row: string) {
    let data = new RegExp(/(.+?)\t(.+?)\t(.+?)\t\$(\d\.\d\d)\s*?(\w.*)/).exec(row);
    this.db.collection('components').add({
      name: data[1],
      vendor: 'GCm9FzeJ8NNpBl6G9BCu',
      description: data[3],
      cost: data[4],
      created: new Date(data[5])
    });
  }

  cost() {
    if (!this.formula || this.formula.components.filter(row => typeof row.component.get == 'function').length > 0)
      return 0;
    let cost = 0;
    this.formula.components.forEach(
      row => (cost += (((row.quantity / this.formula.total) * this._newTotal) / 1000) * row.component.cost)
    );
    return cost;
  }

  prompt() {
    if (this.installPrompt) this.installPrompt.prompt();
  }

  @HostListener('beforeinstallprompt', ['$event'])
  setPrompt(e) {
    this.installPrompt = e;
    this.installPrompt.preventDefault();
  }
}
