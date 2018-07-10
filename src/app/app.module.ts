import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {ConvertFromGPipe, ConvertToGPipe} from './formulaManager/units.pipe';
import {ScalePipe} from './formulaManager/scale.pipe';
import {AngularMaterialModule} from './material.module';
import {HomeComponent} from './home/home.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FormulaManagerComponent} from './formulaManager/formulaManager.component';
import {NgxElectronModule} from 'ngx-electron';

@NgModule({
  declarations: [AppComponent, ConvertFromGPipe, ConvertToGPipe, FormulaManagerComponent, HomeComponent, ScalePipe],
  imports: [
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxElectronModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'formulaManager', component: FormulaManagerComponent},
      {path: '**', component: HomeComponent}
    ]),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
