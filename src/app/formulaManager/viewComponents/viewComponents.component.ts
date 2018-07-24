import {Component} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {map} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {DeleteComponent} from '../../delete/delete.component';
import {NewComponentComponent} from '../newComponent/newComponent.component';
import {AppStore} from '../../app.store';

@Component({
  selector: '',
  templateUrl: './viewComponents.component.html'
})
export class ViewComponents {
  constructor(private dialog: MatDialog, public store: AppStore) {}

  createComponent(component?) {
    if (component) {
      this.dialog.open(NewComponentComponent, {data: component});
    } else {
      this.dialog.open(NewComponentComponent);
    }
  }

  delete(component) {
    this.dialog.open(DeleteComponent, {data: component});
  }
}
