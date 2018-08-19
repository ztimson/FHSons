import { Component, Inject } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppStore } from '../../app.store';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
	selector: 'new-item',
	templateUrl: 'newProduct.component.html'
})
export class NewProductComponent {
	category;
	description: string;
	files: { name: string; link: string; type: string }[] = [];
	image: string;
	linkError = false;
	name: string;
	options: { name: string, price: number, currency: 'CAD' | 'USD', weight: number }[] = [];
	uploading = false;

	constructor(
		private dialogRef: MatDialogRef<NewProductComponent>,
		private db: AngularFirestore,
		private storage: AngularFireStorage,
		@Inject(MAT_DIALOG_DATA) public data,
		public store: AppStore
	) {
		if (data.currentCategory) this.category = data.currentCategory;

		if (data.product) {
			this.category = data.product.category;
			this.description = data.product.originalDescription;
			this.files = data.product.files;
			this.name = data.product.name;
			this.options = data.product.options;
		} else {
			this.addOption();
		}
	}

	async addFile(event) {
		this.uploading = true;
		let file = event.target.files[0];
		let type = 'other';
		if (file.type.indexOf('image') != -1) type = 'preview';
		let upload = await this.storage.ref(`${Math.round(Math.random() * 1000000)}/${file.name}`).put(file);
		this.uploading = false;
		if (upload.state == 'success')
			this.files.push({ name: file.name, type: type, link: await upload.ref.getDownloadURL() });
	}

	addLink(link: string) {
		let valid: any = new RegExp(
			'^(?:(?<protocol>https?):\\/\\/)?(?<name>(?:(?<subdomain>[\\d|\\w]+).)?(?:[\\d|\\w]+\\.[\\d|\\w]+))(?:\\:(?<port>\\d+))?.*'
		).exec(link);
		if (!!valid) {
			if (!valid.groups['protocol']) link = `http://${link}`;
			this.files.push({ name: valid.groups['name'], link: link, type: 'link' });
			this.linkError = !valid;
		}

		return !!valid;
	}

	addOption() {
		this.options.push({ name: '', price: 0, currency: 'CAD', weight: 0 });
	}

	imageChanged(event) {
		let reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = (event: any) => (this.image = event.target.result);
	}

	submit() {
		let newProduct = {
			category: this.category,
			description: this.description,
			files: this.files,
			name: this.name,
			options: this.options.map(row => {
				row.price = <number>row.price;
				row.weight = <number>row.weight;
				return row;
			})
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
