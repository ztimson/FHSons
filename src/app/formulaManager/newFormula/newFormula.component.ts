import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'new-formula',
  templateUrl: './newFormula.component.html'
})
export class NewFormulaComponent {
  constructor(
    private dialogRef: MatDialogRef<NewFormulaComponent>,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
}
