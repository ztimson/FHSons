import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ElectronService} from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, public electron: ElectronService) {}

  ngOnInit() {
    if(this.electron.isElectronApp) {
      this.router.navigate(['/formulaManager']);
    }
  }
}
