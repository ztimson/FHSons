import {Component} from '@angular/core';
import {ConvertFromGPipe, ConvertToGPipe} from './units.pipe';
import {ElectronService} from 'ngx-electron';
import {LocalStorage} from 'webstorage-decorators';
import {MatDialog} from '@angular/material';
import {ViewComponents} from './viewComponents/viewComponents.component';
import {NewFormulaComponent} from './newFormula/newFormula.component';
import {AppStore} from '../app.store';
import {map} from 'rxjs/operators';
import {DeleteComponent} from '../delete/delete.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

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
    formulas;
    @LocalStorage({defaultValue: 'g'})
    unit;
    mobile = false;

    _newTotal: number = 0;
    get newTotal() {
        return new ConvertFromGPipe().transform(this._newTotal, this.unit);
    }

    set newTotal(total) {
        this._newTotal = new ConvertToGPipe().transform(total, this.unit);
    }

    constructor(public electron: ElectronService, private dialog: MatDialog, private $breakpoint: BreakpointObserver, public store: AppStore) {
        this.formulas = this.store.formulas.pipe(map(rows => rows.filter(row => this.store.user || row.approved)));

        // Handle switching between mobile and desktop
        this.$breakpoint.observe(Breakpoints.Handset).subscribe(e => this.mobile = e.matches);
    }

    approve(formula) {
        formula.approved = true;
        formula.ref.update({approved: true});
    }

    cost() {
        let cost = 0;
        this.formula.components.forEach(
            row => (cost += (((row.quantity / this.formula.total) * this._newTotal) / 1000) * row.component.price)
        );
        return cost;
    }

    edit(formula) {
        this.dialog.open(NewFormulaComponent, {data: formula});
    }

    delete(formula) {
        this.dialog.open(DeleteComponent, {data: formula});
    }

    displayFormula(formula) {
        formula.total = formula.components.reduce((acc, row) => (acc += row.quantity), 0);
        this.newTotal = new ConvertFromGPipe().transform(formula.total, this.unit);
        this.formula = formula;
    }

    newFormula() {
        this.dialog.open(NewFormulaComponent);
    }

    openComponents() {
        this.dialog.open(ViewComponents, {height: '500px'});
    }
}
