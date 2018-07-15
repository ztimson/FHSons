import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'delete',
  templateUrl: 'delete.component.html'
})
export class DeleteComponent {
  confirm = '';

  constructor(private dialogRef: MatDialogRef<DeleteComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  delete() {
    this.data.ref.delete().then(() => this.dialogRef.close());
  }
}
