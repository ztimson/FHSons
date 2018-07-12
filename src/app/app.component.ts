import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  categories;

  constructor(private router: Router, private db: AngularFirestore, public electron: ElectronService) {
    this.categories = this.db.collection('categories').valueChanges();
  }

  ngOnInit() {
    if (this.electron.isElectronApp) {
      this.router.navigate(['/formulaManager']);
    }
  }
}
