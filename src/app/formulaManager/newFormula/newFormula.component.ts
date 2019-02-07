import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalStorage } from 'webstorage-decorators';
import { AppStore } from '../../app.store';
import { ConvertToGPipe } from '../units.pipe';

@Component({
	selector: 'new-formula',
	templateUrl: './newFormula.component.html'
})
export class NewFormulaComponent {
	name: string;
	amount: number;
	approved: boolean = false;
	component: string;
	components: { component: Component; quantity: number }[] = [];
	componentsList = [];
	exists: boolean = false;
	@LocalStorage({ defaultValue: 'kg', fieldName: 'newFormulaUnit' })
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
			this.components = this.data.components;
		}
	}

	add() {
		let component = this.componentsList.find(row => row.name == this.component);
		let amount = new ConvertToGPipe().transform(Number(this.amount), this.unit);
		this.components.push({ component: component, quantity: amount });
		this.component = null;
	    this.amount = null;
	}

	checkExists(name) {
		this.store.formulas.subscribe(formulas => {
			this.exists = !!formulas.find(f => f.id == name)
		});
	}

	remove(i) {
		this.components.splice(i, 1);
	}

	submit() {
		let newFormula = {
			name: this.name,
			approved: this.approved,
			components: this.components.map((row: any) => ({component: row.component.id, quantity: row.quantity})),
			createdOn: new Date()
		};

		if (!this.data) {
			this.db.collection('formulas').doc(this.name).set(newFormula).then(ignore => this.dialogRef.close());
		} else {
			this.data.ref.update(newFormula).then(ignore => this.dialogRef.close());
		}
	}

	total() {
		return this.components.reduce((acc, row) => acc + row.quantity, 0);
	}
}
