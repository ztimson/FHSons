import {Component, ElementRef, ViewChildren, HostListener} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ConvertFromGPipe, ConvertToGPipe} from './units.pipe';

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
  unit = 'g';

  _newTotal: number = 0;
  get newTotal() {
    return new ConvertFromGPipe().transform(this._newTotal, this.unit);
  }
  set newTotal(total) {
    this._newTotal = new ConvertToGPipe().transform(total, this.unit);
  }

  constructor(private db: AngularFirestore) {
    this.db.firestore.enablePersistence();
    this.formulas = this.db.collection('formulas').valueChanges();
  }

  displayFormula(formula) {
    formula.components.forEach((row, i, arr) => row.component.get().then(row => (arr[i].component = row.data())));
    formula.total = formula.components.reduce((acc, row) => (acc += row.quantity), 0);
    this.newTotal = formula.total;
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
    console.log(
      this.componentCosts.reduce((acc, row) => {
        console.log(row.nativeElement.html);
        //acc + Number(new RegExp(/\$(\d+\.\d+)/).exec(row.nativeElement.innerHtml)[1])
        return acc;
      }, 0)
    );
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
