import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {AngularFirestore} from 'angularfire2/firestore';
import {filter} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {LoginComponent} from './login/login.component';
import {AngularFireAuth} from 'angularfire2/auth';
import {LocalStorage} from 'webstorage-decorators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  @LocalStorage({defaultValue: []})
  cart: {id: string; item: string; price: number; currency: 'CAD' | 'USD'; quantity: number}[];

  categories;
  user;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private dialog: MatDialog,
    public afAuth: AngularFireAuth,
    public electron: ElectronService
  ) {
    this.categories = this.db.collection('categories').valueChanges();
  }

  addToCart(id: string, item: string, price: number, currency: 'CAD' | 'USD', quantity: number) {
    this.cart = [{id: id, item: item, price: Number(price), currency: currency, quantity: Number(quantity)}].concat(
      this.cart
    );
  }

  cartItemCount() {
    return this.cart.map(row => row.quantity).reduce((acc, row) => acc + row, 0);
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

    this.afAuth.user.subscribe(user => {
      this.user = user;
    });
  }
}
