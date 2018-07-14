import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {MatDialogRef} from '../../../node_modules/@angular/material';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(private dialogRef: MatDialogRef<LoginComponent>, private afAuth: AngularFireAuth) {}

  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
      if (user) this.dialogRef.close();
    });
  }
}
