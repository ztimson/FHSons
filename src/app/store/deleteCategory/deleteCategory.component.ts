import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'delete-category',
  templateUrl: 'deleteCategory.component.html'
})
export class DeleteCategoryComponent {
  confirm = '';

  constructor(private dialogRef: MatDialogRef<DeleteCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  delete() {
    this.data.ref.delete().then(() => this.dialogRef.close());
  }
}
