import {Injectable} from '@angular/core';
import {Router} from '../../../node_modules/@angular/router';

@Injectable()
export class BreadcrumbService {
  breadcrumb: string[] = [];

  constructor(private router: Router) {}

  add(crumb: string) {
    this.breadcrumb.push(crumb);
  }

  clear() {
    this.breadcrumb = [];
  }

  navigate(i: number) {
    this.breadcrumb.splice(i + 1, 9e9);
    this.router.navigate(['/store', this.breadcrumb[i]]);
  }
}
