import {Component} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  email: string;
  error = false;
  password: string;

  constructor(private dialogRef: MatDialogRef<LoginComponent>, private afAuth: AngularFireAuth) {}

  login() {
    this.error = false;
    this.afAuth.auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(user => {
        if (user) {
          this.dialogRef.close();
        } else {
          this.error = true;
        }
      })
      .catch(err => (this.error = true));
  }
}
