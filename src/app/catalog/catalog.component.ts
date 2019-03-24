import {Component, OnDestroy, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {AppComponent} from "../app.component";

@Component({
    selector: 'catalog',
    templateUrl: 'catalog.component.html'
})
export class CatalogComponent implements OnInit, OnDestroy {

    constructor(private app: AppComponent, private sanitize: DomSanitizer) {}

    ngOnInit() {
        this.app.lock = true;
    }

    ngOnDestroy() {
        this.app.lock = false;
    }

    trust(url) { return this.sanitize.bypassSecurityTrustResourceUrl(url); }
}
