import {Component, ViewChild, Inject} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'new-item',
  templateUrl: 'newProduct.component.html'
})
export class NewProductComponent {
  @ViewChild('fileInput') fileInput;

  categories;
  category;
  currency = 'CAD';
  description: string;
  name: string;
  price: number = 0.0;
  image: string;

  constructor(
    private dialogRef: MatDialogRef<NewProductComponent>,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.categories = this.db.collection('categories', ref => ref.orderBy('name')).valueChanges();
    if (data.currentCategory) this.category = data.currentCategory;

    if (data.product) {
      this.category = data.product.category;
      this.currency = data.product.currency;
      this.description = data.product.description;
      this.name = data.product.name;
      this.price = data.product.price;
    }
  }

  imageChanged() {
    let reader = new FileReader();
    reader.addEventListener('load', (event: any) => (this.image = event.target.result));
    reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
  }

  submit() {
    let newProduct = {
      category: this.category,
      currency: this.currency,
      description: this.description,
      name: this.name,
      price: Number(this.price)
    };
    if (this.image) newProduct['image'] = this.image;

    if (!this.data.product) {
      this.db
        .collection('products')
        .add(newProduct)
        .then(data => this.dialogRef.close());
    } else {
      this.data.product.ref.update(newProduct).then(data => this.dialogRef.close());
    }
  }
}
