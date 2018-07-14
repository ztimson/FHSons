import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {MatDialog} from '../../../node_modules/@angular/material';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private dialog: MatDialog, private afAuth: AngularFireAuth) {}

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
      if (user) this.dialog.closeAll();
    });
  }
}
