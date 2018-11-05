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
    storage;

    constructor(public store: AppStore) {
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
    }

    async ngOnInit() {
        let docs = await this.firestore.collection('msds').get();
        docs.forEach(snap => this.links = this.links.concat([snap.data()]).sort());
    }

    open(link) {
        window.open(link.src);
    }

    upload(e) {
        this.storage.ref(`MSDS/${e.files[0].name}`).put(e.files[0]).then(async e => {
            let data = {
                name: e.metadata.name,
                src: await this.storage.ref(e.metadata.fullPath).getDownloadURL()
            };

            console.log(data);

            this.links.concat([data]).sort();
            this.firestore.collection('msds').doc(e.metadata.name).set(data);
        });
    }
}
