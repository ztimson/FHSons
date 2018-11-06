import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import {AppStore} from '../app.store';

@Component({
    selector: 'app-msds',
    templateUrl: './msds.component.html'
})
export class MSDSComponent implements OnInit {
    firestore;
    links = [];
    loading = false;
    storage;

    constructor(public store: AppStore) {
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
    }

    async delete(link) {
        this.loading = true;
        let wait = [
            this.storage.ref(`MSDS/${link.name}`).delete(),
            this.firestore.collection('msds').doc(link.name).delete()
        ];

        await Promise.all(wait);
        this.links.splice(this.links.indexOf(link), 1);
        this.loading = false;
    }

    async ngOnInit() {
        let docs = await this.firestore.collection('msds').get();
        docs.forEach(snap => this.links = this.links.concat([snap.data()]).sort());
    }

    open(link) {
        window.open(link.src);
    }

    upload(e) {
        this.loading = true;
        this.storage.ref(`MSDS/${e.files[0].name}`).put(e.files[0]).then(async e => {
            let data = {
                name: e.metadata.name,
                size: e.metadata.size,
                src: await this.storage.ref(e.metadata.fullPath).getDownloadURL()
            };

            await this.firestore.collection('msds').doc(e.metadata.name).set(data);
            this.links = this.links.concat([data]).sort();
            this.loading = false;
        });
    }
}
