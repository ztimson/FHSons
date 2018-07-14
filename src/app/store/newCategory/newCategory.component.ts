import {Component, ViewChild, Inject} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '../../../../node_modules/@angular/material';

@Component({
  selector: 'new-category',
  templateUrl: 'newCategory.component.html'
})
export class NewCategoryComponent {
  @ViewChild('fileInput') fileInput;

  parent: string = 'root';
  name: string;
  image: string;

  constructor(
    private dialogRef: MatDialogRef<NewCategoryComponent>,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  imageChanged() {
    let reader = new FileReader();
    reader.addEventListener('load', (event: any) => (this.image = event.target.result));
    reader.readAsText(this.fileInput.nativeElement.files[0]);
  }

  submit() {
    if (!this.data) {
      this.db
        .collection('categories')
        .add({name: this.name, image: this.image, parent: this.parent == 'root' ? null : this.parent})
        .then(data => this.dialogRef.close());
    }
  }
}
