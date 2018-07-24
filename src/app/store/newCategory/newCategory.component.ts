import {Component, ViewChild, Inject} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AppStore} from '../../app.store';

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
    @Inject(MAT_DIALOG_DATA) public data,
    public store: AppStore
  ) {
    if (data.currentCategory) this.parent = data.currentCategory;

    if (data.category) {
      this.name = data.category.name;
      this.parent = data.category.parent == null ? 'root' : data.category.parent;
    }
  }

  imageChanged() {
    let reader = new FileReader();
    reader.addEventListener('load', (event: any) => (this.image = event.target.result));
    reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
  }

  submit() {
    let newCategory = {name: this.name, parent: this.parent == 'root' ? null : this.parent};
    if (this.image) newCategory['image'] = this.image;

    if (!this.data.category) {
      this.db
        .collection('categories')
        .add(newCategory)
        .then(data => this.dialogRef.close());
    } else {
      this.data.category.ref.update(newCategory).then(data => this.dialogRef.close());
    }
  }
}
