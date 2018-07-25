import {Component, ElementRef, ViewChildren, HostListener} from '@angular/core';
import {ConvertFromGPipe, ConvertToGPipe} from './units.pipe';
import {ElectronService} from 'ngx-electron';
import {LocalStorage} from 'webstorage-decorators';
import {MatDialog} from '@angular/material';
import {ViewComponents} from './viewComponents/viewComponents.component';
import {NewFormulaComponent} from './newFormula/newFormula.component';
import {AppStore} from '../app.store';

@Component({
  selector: 'formula-manager',
  templateUrl: './formulaManager.component.html',
  styles: [
    `
      .active {
        background-color: #f0f0f0;
      }
    `
  ]
})
export class FormulaManagerComponent {
  formula;
  @LocalStorage({defaultValue: 'g'})
  unit;

  _newTotal: number = 0;
  get newTotal() {
    return new ConvertFromGPipe().transform(this._newTotal, this.unit);
  }
  set newTotal(total) {
    this._newTotal = new ConvertToGPipe().transform(total, this.unit);
  }

  constructor(public electron: ElectronService, private dialog: MatDialog, public store: AppStore) {}

  openComponents() {
    this.dialog.open(ViewComponents, {height: '500px'});
  }

  cost() {
    let cost = 0;
    this.formula.components.forEach(
      row => (cost += (((row.quantity / this.formula.total) * this._newTotal) / 1000) * row.component.cost)
    );
    return cost;
  }

  displayFormula(formula) {
    formula.total = formula.components.reduce((acc, row) => (acc += row.quantity), 0);
    this.newTotal = new ConvertFromGPipe().transform(formula.total, this.unit);
    this.formula = formula;
  }

  newFormula() {
    this.dialog.open(NewFormulaComponent);
  }
}
