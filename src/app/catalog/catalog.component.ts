import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'catalog',
    templateUrl: 'catalog.component.html'
})
export class CatalogComponent implements OnInit{

    constructor(private http: HttpClient, private sanatize: DomSanitizer) {}

    ngOnInit() {}

    trust(url) { return this.sanatize.bypassSecurityTrustResourceUrl(url); }
}
