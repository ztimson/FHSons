import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {filter} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {LoginComponent} from './login/login.component';
import {LocalStorage} from 'webstorage-decorators';
import {AppStore} from './app.store';
import {AngularFireAuth} from '../../node_modules/angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  @LocalStorage({defaultValue: []})
  cart: {id: string; item: string; price: number; currency: 'CAD' | 'USD'; quantity: number}[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public electron: ElectronService,
    public store: AppStore,
    public afAuth: AngularFireAuth
  ) {}

  cartAdd(id: string, item: string, price: number, currency: 'CAD' | 'USD', quantity: number) {
    this.cart = [{id: id, item: item, price: Number(price), currency: currency, quantity: Number(quantity)}].concat(
      this.cart
    );
  }

  cartCount() {
    return this.cart.map(row => row.quantity).reduce((acc, row) => acc + row, 0);
  }

  cartRemove(i) {
    let temp = this.cart;
    this.cart = temp.slice(i, 1);
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  ngOnInit() {
    // Record routing for analytics
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      let ga = (<any>window).ga;
      if (ga) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

    // Send electron users right to formula manager
    if (this.electron.isElectronApp) {
      this.router.navigate(['/formulaManager']);
    }
  }
}
